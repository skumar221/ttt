import React from 'react'
import _ from 'lodash'
import Board from '../functional-components/Board.jsx'

import { PLAY, WIN, DRAW, REPLAY } from '../constants/gamePhases.js'

import { checkWinner } from '../util/winUtils.js'

import * as plrs from '../constants/players.js'

import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'
import * as AI from '../ai/AI.js'

const _generateEmptyMoves = (rows=3, cols=3) => {
  let i = 0, moves = []
  while (i < rows) {
    moves.push(_.fill(Array(cols), null))
    i++
  }

  return moves
}

const _getInitialState = () => ({
  rows: 3,
  cols: 3,
  moves: _generateEmptyMoves(3, 3), //[[-1, 1, null], [null, -1, 1], [null, null, null]],
  moveHistory: [],
  gamePhase: PLAY,
  players: plrs.asObj,
  currPlayer: plrs.PLAYER,
  difficulty: HARD,
  aiMistakeProbability: 0.00,
  hint: null
})

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = _getInitialState()

      this._onCellClicked = this._onCellClicked.bind(this)
      this._insertMove = this._insertMove.bind(this)
      this._onGameWon = this._onGameWon.bind(this)
      this._getCurrentMessage = this._getCurrentMessage.bind(this)
      this._isBoardDisabled = this._isBoardDisabled.bind(this)
      this._maybeMoveAI = this._maybeMoveAI.bind(this)
      this._setDifficulty = this._setDifficulty.bind(this)
      this._renderDifficultyButtonRow = this._renderDifficultyButtonRow.bind(this)
      this._renderGameControls = this._renderGameControls.bind(this)
      this._renderOtherControls = this._renderOtherControls.bind(this)
      this._replayGame = this._replayGame.bind(this)
  }

  componentDidUpdate() {
    const { rows, cols, moves, moveHistory, currPlayer, gamePhase, difficulty} = this.state

    if (gamePhase !== PLAY) {
      return
    }

    const winner = checkWinner(moves, rows, cols)

    switch (winner) {
      case null:
        this._maybeMoveAI(currPlayer, gamePhase, difficulty)
        break
      case 0:
        this._onGameDraw()
        break
      default:
        this._onGameWon()
        break
    }
  }

  /**
  * @param {number} currPlayer
  * @param {number} gamePhase
  * @param {number} difficulty
  */
  _maybeMoveAI(currPlayer, gamePhase, difficulty) {
    if (currPlayer !== plrs.AI || gamePhase !== PLAY) {
      return
    }

    const {row, col} = AI.play(this.state.moves, difficulty, currPlayer, this.state.aiMistakeProbability)

    setTimeout(() => {
      this._insertMove(row, col)
    }, 500)
  }

  _reset() {
    this.setState({
      ..._getInitialState(),
      difficulty: this.state.difficulty,
      aiMistakeProbability: this.state.aiMistakeProbability
    })
  }

  _onCellClicked(row, col) {
    this._insertMove(row, col)
  }

  _onGameDraw() {
    this.setState({
      gamePhase: DRAW
    })
  }

  _onGameWon() {
    this.setState({
      gamePhase: WIN
    })
  }

  _replayGame() {
    this.setState({
      gamePhase: REPLAY,
      moves: _generateEmptyMoves(),
    }, () => {
      const mh = [...this.state.moveHistory]
      let moves = _generateEmptyMoves(), i = 0

      const interval = setInterval(() => {
        if (i === mh.length) {
          setTimeout(() => {
            clearInterval(interval)
            this._onGameWon()
          }, 1000)
          return
        }

        let moves = this.state.moves
        const move = mh[i]
        moves[move.row][move.col] = move.player

        this.setState({
          moves: moves
        })

        i++
      }, 1000)
    })
  }

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

  _getCurrentMessage() {
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
          <div className='message-text'>{`${otherPlayerName} wins!`}</div>,
          <div className='reset-button' onClick={() => {this._reset()}}>New Game</div>,
          <div className='instant-replay-button' onClick={() => {this._replayGame()}}>Replay game</div>
        ]
        break
      case DRAW:
        msg = [
          <div className='message-text'>Draw!</div>,
          <div className='reset-button' onClick={() => {this._reset()}}>New Game</div>,
          <div className='instant-replay-button' onClick={() => {this._replayGame()}}>Replay game</div>
        ]
        break
      case REPLAY:
        msg = [
          <div>Replaying...</div>
        ]
        break
      default:
        msg = null
    }

    return (
      <div className='message'>
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
      <div className='game-controls'>
        {this._renderDifficultyButtonRow()}
        {this._renderOtherControls()}
      </div>
    )
  }

  _renderOtherControls() {
    const _onMistakeProbabilityChange = e => {
      this.setState({
        aiMistakeProbability: parseFloat(e.target.value)
      })
    }
    const { gamePhase, currPlayer } = this.state

    const _onHintClicked = e => {
      e.stopPropagation()
      if (!(currPlayer === plrs.PLAYER && gamePhase === PLAY)) {
        return
      }

      const {row, col} = AI.play(this.state.moves, HARD, plrs.PLAYER, 0)
      this.setState({
        hint: {
          row: row,
          col: col,
          player: plrs.PLAYER
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
      <div className='other-controls'>
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
      <div className='difficulty-button-row'>
        <div className={easyToggleClass} onClick={(e) => { this._setDifficulty(EASY)}}>Easy</div>
        <div className={mediumToggleClass} onClick={(e) => {this._setDifficulty(MEDIUM)}}>Medium</div>
        <div className={hardToggleClass} onClick={(e) => {this._setDifficulty(HARD)}}>Hard</div>
      </div>
    ]
  }

  render() {
    const { rows, cols, moves } = this.state
    console.log('moves', moves)

    return (
      <div className='tic-tac-toe'>
        <div className='ttt-left-col'>
          <Board
            rows={rows}
            cols={cols}
            moves={moves}
            disabled={this._isBoardDisabled()}
            players={this.state.players}
            onCellClicked={this._onCellClicked}
            hint={this.state.hint} />
        </div>
        <div className='ttt-right-col'>
          <div className='message-box'>
            {this._renderGameControls()}
            {this._getCurrentMessage()}
          </div>
        </div>
      </div>
    )
  }
}

export default TicTacToe
