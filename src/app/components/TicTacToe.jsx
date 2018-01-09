import React from 'react'
import _ from 'lodash'
import Board from '../functional-components/Board.jsx'
import * as plrs from '../constants/players.js'
import * as AI from '../ai/AI.js'
import { PLAY, WIN, DRAW, REPLAY } from '../constants/gamePhases.js'
import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'
import { checkWinner } from '../util/winUtils.js'

/**
* Returns a null-filled 2D array that represents the TTT board
*
* @param {number} rows
* @param {number} cols
*
* @return {array<array<null>>}
*/
const _generateEmptyMoves = (rows=3, cols=3) => {
  let i = 0, moves = []
  while (i < rows) {
    moves.push(_.fill(Array(cols), null))
    i++
  }
  return moves
}

/**
* Returns the initial state.
*
* @return {object}
*/
const _getInitialState = () => ({
  rows: 3,
  cols: 3,
  moves: _generateEmptyMoves(3, 3), //[[-1, 1, null], [null, -1, 1], [null, null, null]],
  moveHistory: [],
  gamePhase: PLAY,
  players: plrs.asObj,
  currPlayer: plrs.HUMAN,
  difficulty: HARD,
  aiMistakeProbability: 0.00,
  hint: null,
  winSet: null
})

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = _getInitialState()

      this._insertMove = this._insertMove.bind(this)
      this._onGameWon = this._onGameWon.bind(this)
      this._renderMessageBox = this._renderMessageBox.bind(this)
      this._isBoardDisabled = this._isBoardDisabled.bind(this)
      this._maybeMoveAI = this._maybeMoveAI.bind(this)
      this._setDifficulty = this._setDifficulty.bind(this)
      this._renderDifficultyButtonRow = this._renderDifficultyButtonRow.bind(this)
      this._renderGameControls = this._renderGameControls.bind(this)
      this._renderOtherControls = this._renderOtherControls.bind(this)
      this._replayGame = this._replayGame.bind(this)
      this._maybeCheckWinner = this._maybeCheckWinner.bind(this)
  }

  componentDidUpdate() {
    this._maybeCheckWinner()
  }

  render() {
    const { rows, cols, moves } = this.state
    return (
      <div className='tic-tac-toe'>
        <div className='ttt-left-col'>
          <Board
            rows={rows}
            cols={cols}
            moves={moves}
            disabled={this._isBoardDisabled()}
            players={this.state.players}
            onCellClicked={this._insertMove}
            hint={this.state.hint}
            winSet={this.state.winSet} />
        </div>
        <div className='ttt-right-col'>
          <div className='message-box'>
            {this._renderGameControls()}
            {this._renderMessageBox()}
          </div>
        </div>
      </div>
    )
  }

  /**
  * Checks for the winner of a board, with the option to skip a check of whether
  * the gamePhase is suitable to determine a winner.
  *
  * @param {boolean} checkGamePhase Optional check of the game phase, defaulted
  *   true.  If false, proceeds to check the board as it is.
  */
  _maybeCheckWinner(checkGamePhase=true) {
    const { rows, cols, moves, gamePhase } = this.state

    if (gamePhase !== PLAY && checkGamePhase === true) {
      return
    }

    const winObj = checkWinner(moves, rows, cols)
    switch (winObj.winner) {
      case null:
        this._maybeMoveAI()
        break
      case 0:
        this._onGameDraw()
        break
      default:
        this._onGameWon(winObj)
        break
    }
  }

  /**
  * Create a move for the AI if the currentPlayer is the AI
  * and game phase is play.
  */
  _maybeMoveAI() {
    const { currPlayer, gamePhase, difficulty} = this.state
    if (currPlayer !== plrs.AI || gamePhase !== PLAY) {
      return
    }

    const {row, col} = AI.play(this.state.moves, difficulty, currPlayer, this.state.aiMistakeProbability)

    //Slight delay for playing the AI so it doesn't feel so robotic
    setTimeout(() => {
      this._insertMove(row, col)
    }, 300)
  }

  /**
  * Reset the game, retaining difficulty and aiMistakeProbability settings.
  */
  _reset() {
    this.setState({
      ..._getInitialState(),
      difficulty: this.state.difficulty,
      aiMistakeProbability: this.state.aiMistakeProbability
    })
  }

  _onGameDraw() {
    this.setState({
      gamePhase: DRAW
    })
  }

  /**
  * @param {object} winObj The winner object containing who and where the win
  *   belongs to
  */
  _onGameWon(winObj) {
    let winSet = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    switch (winObj.type) {
      case 'downDiagonal':
        winSet = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]
        break
      case 'upDiagonal':
        winSet = [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0]
        ]
        break
      case 'column':
        const col = winObj.value
        for (let i = 0; i < this.state.rows; i++) {
          winSet[i][col] = 1
        }
        break
      case 'row':
        const row = winObj.value
        for (let i = 0; i < this.state.cols; i++) {
          winSet[row][i] = 1
        }
        break
    }

    this.setState({
      gamePhase: WIN,
      winSet: winSet
    })
  }

  /**
  * Uses a series of setTimeouts and setIntervals to replay the finished game.
  * A little hacky, but suitable enough for this purpose.
  */
  _replayGame() {
    this.setState({
      gamePhase: REPLAY,
      moves: _generateEmptyMoves(),
    }, () => {
      const mh = [...this.state.moveHistory]
      let moves = _generateEmptyMoves(), i = 0

      const interval = setInterval(() => {
        if (i === mh.length) {
          clearInterval(interval)
          this._maybeCheckWinner(false)
          return
        }

        let moves = this.state.moves
        const move = mh[i]
        moves[move.row][move.col] = move.player

        this.setState({
          moves: moves
        })

        i++
      }, 500)
    })
  }

  /**
  * Insert's a move with a given row and col, using state.currPlayer to determine
  * who the move belongs to.
  *
  * @param {number} row
  * @param {number} col
  */
  _insertMove(row, col) {
    let { moves, moveHistory, currPlayer } = this.state
    moves[row][col] = currPlayer

    this.setState({
      moves: moves,
      moveHistory: this.state.moveHistory.concat([{
          row: row,
          col: col,
          player: currPlayer
        }]),
      currPlayer: plrs.getOtherPlayer(currPlayer)
    })
  }

  /**
  * Renders the message box responsive to state.
  */
  _renderMessageBox() {
    const { players, currPlayer, moveHistory, gamePhase }  = this.state
    const playerName = this.state.players[currPlayer].name
    const otherPlayerName = this.state.players[plrs.getOtherPlayer(currPlayer)].name

    let msg
    switch(gamePhase) {
      case PLAY:
        msg =  `The current player is "${playerName}".`
        if (currPlayer === plrs.AI) {
          msg += ' (AI)'
        }
        break
      case WIN:
        msg = [
          <div className='message-text' key='win-msg'>{`${otherPlayerName} wins!`}</div>,
          <div className='reset-button' key='new-game-button' onClick={() => {this._reset()}}>New Game</div>,
          <div className='instant-replay-button' key='replay-win-button' onClick={() => {this._replayGame()}}>Replay game</div>
        ]
        break
      case DRAW:
        msg = [
          <div className='message-text' key='draw-button'>Draw!</div>,
          <div className='reset-button' key='reset-button' onClick={() => {this._reset()}}>New Game</div>,
          <div className='instant-replay-button' key='replay-button' onClick={() => {this._replayGame()}}>Replay game</div>
        ]
        break
      case REPLAY:
        msg = [
          <div key='replay-text'>Replaying...</div>
        ]
        break
      default:
        msg = null
    }

    return (
      <div className='message' key='message'>
        {msg}
      </div>
    )
  }

  _isBoardDisabled() {
    const { gamePhase, currPlayer } = this.state
    return gamePhase === WIN || gamePhase === DRAW || currPlayer === plrs.AI || gamePhase === REPLAY
  }

  _setDifficulty(difficulty) {
    const { gamePhase } = this.state

    // Start a new game if toggling diffulty when game is over
    let callback = (gamePhase === WIN || gamePhase === DRAW) ?
      this._reset : _.noop

    this.setState({
      difficulty: difficulty
    }, callback)
  }

  _renderGameControls() {
    return (
      <div className='game-controls' key='game-controls'>
        {this._renderDifficultyButtonRow()}
        {this._renderOtherControls()}
      </div>
    )
  }

  /**
  * Renders the aiMistakeProbability input and hint buttons
  */
  _renderOtherControls() {
    const _onMistakeProbabilityChange = e => {
      this.setState({
        aiMistakeProbability: parseFloat(e.target.value)
      })
    }
    const { gamePhase, currPlayer } = this.state

    const _onHintClicked = e => {
      e.stopPropagation()
      if (!(currPlayer === plrs.HUMAN && gamePhase === PLAY)) {
        return
      }

      const {row, col} = AI.play(this.state.moves, HARD, plrs.HUMAN, 0)
      this.setState({
        hint: {
          row: row,
          col: col,
          player: plrs.HUMAN
        }
      }, () => {
        setTimeout(() => {
          this.setState({
            hint: null
          })
        }, 1000)
      })
    }

    return (
      <div className='other-controls' key='other-controls'>
        AI Mistake Probability
        <input type="number" step="0.001" min="0" max="1"
          value={this.state.aiMistakeProbability.toString()}
          onChange={_onMistakeProbabilityChange} />
        <div className='hint-button' onClick={_onHintClicked} >Hint</div>
      </div>
    )
  }

  _renderDifficultyButtonRow() {
    let easyToggleClass = 'easy-toggle',
      mediumToggleClass = 'medium-toggle',
      hardToggleClass = 'hard-toggle'

    switch(this.state.difficulty) {
      case EASY:
        easyToggleClass += ' selected'
        break
      case MEDIUM:
        mediumToggleClass += ' selected'
        break
      case HARD:
        hardToggleClass += ' selected'
        break
    }

    return [
      <div className='difficulty-button-row' key='difficulty-button-row'>
        <div className={easyToggleClass} onClick={(e) => { this._setDifficulty(EASY)}}>Easy</div>
        <div className={mediumToggleClass} onClick={(e) => {this._setDifficulty(MEDIUM)}}>Medium</div>
        <div className={hardToggleClass} onClick={(e) => {this._setDifficulty(HARD)}}>Hard</div>
      </div>
    ]
  }
}

export default TicTacToe
