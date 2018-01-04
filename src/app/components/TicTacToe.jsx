import React from 'react'
import _ from 'lodash'
import Board from '../functional-components/Board.jsx'

import { PLAY, WIN, DRAW } from '../constants/gamePhases.js'

import { checkWinner } from '../util/winUtils.js'

import * as plrs from '../constants/players.js'

import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'
import * as AI from '../ai/AI.js'

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
  moves: _generateEmptyMoves(3, 3), //[[-1, 1, 1], [-1, -1, 1], [null, null, null]],
  moveHistory: [],
  gamePhase: PLAY,
  players: plrs.asObj,
  currPlayer: plrs.PLAYER,
  difficulty: HARD
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

    const {row, col} = AI.play(this.state.moves, difficulty)

    setTimeout(() => {
      this._insertMove(row, col)
    }, 500)
  }

  _reset() {
    this.setState({
      ..._getInitialState(),
      difficulty: this.state.difficulty
    })
  }

  _onCellClicked(row, col) {
    this._insertMove(row, col)
  }

  _onGameDraw() {
    this.setState({
      gamePhase: DRAW
    }, () => {
      setTimeout(() => {
        this._reset()
      }, 3000)
    })
  }

  _onGameWon() {
    this.setState({
      gamePhase: WIN
    }, () => {
      setTimeout(() => {
        this._reset()
      }, 3000)
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

    switch(gamePhase) {
      case PLAY:
        let msg =  `The current player is "${playerName}".`
        if (currPlayer === plrs.AI) {
          msg += ' (AI)'
        }
        return msg
        break
      case WIN:
        return `${otherPlayerName} wins!`
        break
      case DRAW:
        return `Draw!`
        break
      default:
        return ''
        break
    }
  }

  _isBoardDisabled() {
    const { gamePhase, currPlayer } = this.state
    return gamePhase === WIN || gamePhase === DRAW || currPlayer === plrs.AI
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
