import React from 'react'
import Board from '../functional-components/Board.jsx'

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        rows: 3,
        cols: 3,
        moves: [],
        moveHistory: [],
        gameOver: false,
        players: [{
          name: "Purayan",
          symbol: "X",
          color: '#663399'
        }, {
          name: "Vindastikal",
          symbol: "O",
          color: '#3dd60d'
        }],
        currPlayer: 0
      }

      this._onCellClicked = this._onCellClicked.bind(this)
      this._generateEmptyMoves = this._generateEmptyMoves.bind(this)
      this._insertMove = this._insertMove.bind(this)
      this._checkWin = this._checkWin.bind(this)
      this._onGameWon = this._onGameWon.bind(this)

      this.state.moves = this._generateEmptyMoves()
  }

  _reset() {
    this.setState({
      moves: this._generateEmptyMoves(),
      moveHistory: [],
      gameOver: false,
      currPlayer: 0
    })
  }

  _generateEmptyMoves() {
    let i = 0, moves = []
    while (i < this.state.rows) {
      moves.push(new Array())
      i++
    }

    return moves
  }

  _onCellClicked(row, col, player) {
    this._insertMove(row, col, player)
  }

  _checkWin(move, moves) {
    const {row, col, player} = move
    const totalRows = this.state.rows
    const totalCols = this.state.cols
    let c = 0, r = 0, rowCount = 0, colCount = 0, NWtoSECount = 0, SWtoNEcount = 0

    // check column
    while (r < totalRows) {
      const val = _.get(moves, `${r}.${col}.value`)
      if (val === move.value) {
        rowCount++
      } else {
        break
      }
      r++
    }

    if (rowCount === totalRows) {
      this._onGameWon(move)
    }

    // check row
    while (c < totalCols) {
      const val = _.get(moves, `${row}.${c}.value`)
      if (val === move.value) {
        colCount++
      } else {
        break
      }
      c++
    }

    if (colCount === totalCols) {
      this._onGameWon(move)
    }

    // don't check diagonals if totalRows != totalCols
    if (totalRows !== totalCols) {
      return
    }

    // check \ diagonal
    // TODO: Optimize this?
    r = 0, c = 0
    while (r  < totalRows && c < totalCols) {
      if (move.value === _.get(moves, `${r}.${c}.value`)) {
        NWtoSECount++
      } else {
        break
      }

      r++
      c++
    }

    if (NWtoSECount === totalRows) {
      this._onGameWon(move)
    }

    // check / diagonal
    // TODO: Optimize this?
    r = totalRows - 1, c = 0
    while (r >= 0 && c < totalCols) {
      if (move.value === _.get(moves, `${r}.${c}.value`)) {
        SWtoNEcount++
      } else {
        break
      }

      r--
      c++
    }

    if (SWtoNEcount === totalRows) {
      this._onGameWon(move)
    }
  }

  _onGameWon(move) {
    this.setState({
      gameOver: true
    }, () => {
      setTimeout(() => {
        this._reset()
      }, 3000)
    })
  }

  _getOtherPlayer(p) {
    return p ? 0 : 1
  }

  _insertMove(row, col) {
    let moves = {
      ...this.state.moves
    }

    const player = this.state.players[this.state.currPlayer]
    const move = {
        player: player,
        value: player.symbol,
        row: row,
        col: col
    }

    moves[row][col] = move

    this.setState({
      moves: moves,
      moveHistory: this.state.moveHistory.concat([
        move
      ]),
      currPlayer: this._getOtherPlayer(this.state.currPlayer)
    }, () => {
      this._checkWin(move, this.state.moves)
    })
  }

  render() {
    const winner = this.state.gameOver ? `${this.state.moveHistory[this.state.moveHistory.length - 1].player} wins!` : null
    const currPlayer = this.state.gameOver ? '' : `The current player is "${this.state.players[this.state.currPlayer].name}".`
    return (
      <div className='tic-tac-toe'>
        <div className='ttt-left-col'>
          <Board
            rows={this.state.rows}
            cols={this.state.cols}
            moves={this.state.moves}
            disabled={this.state.gameOver}
            onCellClicked={this._onCellClicked} />
        </div>
        <div className='ttt-right-col'>
          <div>{winner}</div>
          <div>{currPlayer}</div>
        </div>
      </div>
    )
  }
}

export default TicTacToe
