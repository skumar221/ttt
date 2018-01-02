import React from 'react'
import _ from 'lodash'
import Board from '../functional-components/Board.jsx'
import { GamePhases } from '../constants/GamePhases.js'
import { DifficultyLevels } from '../constants/DifficultyLevels.js'
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
  moves: _generateEmptyMoves(3, 3),
  moveHistory: [],
  gamePhase: GamePhases.PLAY,
  players: [{
    name: "Player",
    symbol: "X",
    color: '#663399'
  }, {
    name: "CPU",
    symbol: "O",
    color: '#3dd60d'
  }],
  currPlayer: 0,
  cpuPlayer: 1,
  difficultyLevel: DifficultyLevels.HARD
})

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = _getInitialState()

      this._onCellClicked = this._onCellClicked.bind(this)
      this._insertMove = this._insertMove.bind(this)
      this._checkGameOver = this._checkGameOver.bind(this)
      this._onGameWon = this._onGameWon.bind(this)
      this._getCurrentMessage = this._getCurrentMessage.bind(this)
      this._isBoardDisabled = this._isBoardDisabled.bind(this)
      this._moveCPU = this._moveCPU.bind(this)
  }

  componentDidUpdate() {
    const { rows, cols, moves, moveHistory, currPlayer, cpuPlayer, gamePhase } = this.state

    if (gamePhase !== GamePhases.PLAY) {
      return
    }

    const moveCPU = () => {
      if (currPlayer === cpuPlayer && gamePhase === GamePhases.PLAY) {
        this._moveCPU()
      }
    }

    console.log("moves", moves.length, moves, moveHistory)

    if (moveHistory.length < ((rows * 2) - 1)) {
      moveCPU()
      return
    }

    this._checkGameOver(moves, moveCPU)
  }

  _moveCPU() {
    const { difficultyLevel } = this.state
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
      this._insertMove(row, col, 1000)
    }, 500)

  }

  _reset() {
    this.setState({
      ..._getInitialState(),
      difficultyLevel: this.state.difficultyLevel
    })
  }

  _onCellClicked(row, col) {
    this._insertMove(row, col)
  }

  _checkGameOver(moves, onGameNotOver) {
    console.log("check game over")
    const move = _.last(moves)
    const { row, col, player } = move
    const { rows, cols, moveHistory } = this.state
    let c = 0, r = 0, rowCount = 0, colCount = 0, NWtoSECount = 0, SWtoNEcount = 0

    // check column
    while (r < rows) {
      const val = _.get(moves, `${r}.${col}.value`)
      if (val === move.value) {
        rowCount++
      } else {
        break
      }
      r++
    }

    if (rowCount === rows) {
      this._onGameWon(move)
      return
    }

    // check row
    while (c < cols) {
      const val = _.get(moves, `${row}.${c}.value`)
      if (val === move.value) {
        colCount++
      } else {
        break
      }
      c++
    }

    if (colCount === cols) {
      this._onGameWon(move)
      return
    }

    // don't check diagonals if rows != cols
    if (rows !== cols) {
      return
    }

    // check \ diagonal
    // TODO: Optimize this?
    r = 0, c = 0
    while (r  < rows && c < cols) {
      if (move.value === _.get(moves, `${r}.${c}.value`)) {
        NWtoSECount++
      } else {
        break
      }

      r++
      c++
    }

    if (NWtoSECount === rows) {
      this._onGameWon(move)
      return
    }

    // check / diagonal
    // TODO: Optimize this?
    r = rows - 1, c = 0
    while (r >= 0 && c < cols) {
      if (move.value === _.get(moves, `${r}.${c}.value`)) {
        SWtoNEcount++
      } else {
        break
      }

      r--
      c++
    }

    if (SWtoNEcount === rows) {
      this._onGameWon(move)
      return
    }

    // check draw
    if (moveHistory.length === (rows * cols)) {
      this._onGameDraw()
      return
    }

    console.log("game is not over")

    if (onGameNotOver) {
      onGameNotOver()
    }
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
    return p ? 0 : 1
  }

  _insertMove(row, col, timeout = 1) {
    const { moves, players, currPlayer, moveHistory } = this.state
    const player = players[currPlayer]
    const move = {
        player: player,
        value: player.symbol,
        row: row,
        col: col
    }

    moves[row][col] = move

    this.setState({
      moves: moves,
      moveHistory: moveHistory.concat([
        move
      ]),
      currPlayer: this._getOtherPlayer(currPlayer)
    })
  }

  _getCurrentMessage() {
    const { players, currPlayer, moveHistory, gamePhase, cpuPlayer }  = this.state

    switch(gamePhase) {
      case GamePhases.PLAY:
        const _player = players[currPlayer]
        let msg =  `The current player is "${_player.name}": ${_player.symbol}.`
        if (cpuPlayer === currPlayer) {
          msg += ' (CPU)'
        }
        return msg
        break
      case GamePhases.WIN:
        return `${moveHistory[moveHistory.length - 1].player.name} wins!`
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
    const { gamePhase, cpuPlayer, currPlayer } = this.state
    return gamePhase === GamePhases.WIN ||
      gamePhase === GamePhases.DRAW ||
      cpuPlayer === currPlayer
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
