import React from 'react'
import _ from 'lodash'
import Board from '../functional-components/Board.jsx'
import { GamePhases } from '../constants/GamePhases.js'
import { DifficultyLevels } from '../constants/DifficultyLevels.js'
import * as AI from '../ai/AI.js'
import { checkWinner } from '../util/checkWinner.js'
import * as Players from '../constants/Players.js'

const _generateEmptyMoves = (rows, cols) => {
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
  moves: _generateEmptyMoves(3, 3),
  moveHistory: [],
  gamePhase: GamePhases.PLAY,
  players: {
    [Players.PLAYER]: {
      name: "Player",
      symbol: "X",
      color: '#663399'
    },
    [Players.AI]: {
      name: "AI",
      symbol: "O",
      color: '#3dd60d'
    }
  },
  currPlayer: 0,
  difficultyLevel: DifficultyLevels.HARD
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
  }

  componentDidUpdate() {
    const { rows, cols, moves, moveHistory, currPlayer, gamePhase, difficultyLevel} = this.state

    if (gamePhase !== GamePhases.PLAY) {
      return
    }

    const winner = checkWinner(moves, rows, cols)
    console.log('winner', winner)

    switch (winner) {
      case null:
        this._maybeMoveAI(currPlayer, gamePhase, difficultyLevel)
        break
      case 0:
        this._onGameDraw()
        break
      case 1:
      case 2:
        this._onGameWon()
        break
    }
  }

  /**
  * @param {number} currPlayer
  * @param {number} gamePhase
  */
  _maybeMoveAI(currPlayer, gamePhase, difficultyLevel) {
    if (currPlayer !== Players.AI || gamePhase !== GamePhases.PLAY) {
      return
    }

    let row, col
    switch(difficultyLevel) {
      case DifficultyLevels.EASY:
        ({ row, col } = AI.easy(this.state))
        break
      case DifficultyLevels.MEDIUM:
        ({ row, col } = AI.medium(this.state))
        break
      case DifficultyLevels.HARD:
        ({ row, col } = AI.hard(this.state))
        break
      default:
        break
    }

    setTimeout(() => {
      this._insertMove(this.state.currPlayer, row, col)
    }, 500)
  }

  _reset() {
    this.setState({
      ..._getInitialState(),
      difficultyLevel: this.state.difficultyLevel
    })
  }

  _onCellClicked(row, col) {
    this._insertMove(this.state.currPlayer, row, col)
  }

  _onGameDraw() {
    this.setState({
      gamePhase: GamePhases.DRAW
    }, () => {
      setTimeout(() => {
        this._reset()
      }, 3000)
    })
  }

  _onGameWon() {
    this.setState({
      gamePhase: GamePhases.WIN
    }, () => {
      setTimeout(() => {
        this._reset()
      }, 3000)
    })
  }

  _getOtherPlayer(p) {
    return p === Players.AI ? Players.Player : Players.AI
  }

  _insertMove(player, row, col) {
    let { moves, moveHistory, currPlayer } = this.state
    moves[row][col] = player
    this.setState({
      moves: moves,
      moveHistory: this.state.moveHistory.concat([
        {
          row: row,
          col: col,
          player: player
        }
      ]),
      currPlayer: this._getOtherPlayer(currPlayer)
    })
  }

  _getCurrentMessage() {
    const { players, currPlayer, moveHistory, gamePhase, aiPlayer }  = this.state

    switch(gamePhase) {
      case GamePhases.PLAY:
        let msg =  `The current player is "${currPlayer}".`
        if (aiPlayer === currPlayer) {
          msg += ' (AI)'
        }
        return msg
        break
      case GamePhases.WIN:
        return `${moveHistory[moveHistory.length - 1].player === aiPlayer} wins!`
        break
      case GamePhases.DRAW:
        return `Draw!`
        break
      default:
        return ''
        break
    }
  }

  _isBoardDisabled() {
    const { gamePhase, aiPlayer, currPlayer } = this.state
    return gamePhase === GamePhases.WIN ||
      gamePhase === GamePhases.DRAW ||
      aiPlayer === currPlayer
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
            onCellClicked={this._onCellClicked} />
        </div>
        <div className='ttt-right-col'>
          <div className='message-box'>
            <div>{this._getCurrentMessage()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default TicTacToe
