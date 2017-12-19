import React from 'react'
import Board from '../functional-components/Board.jsx'

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        rows: 3,
        cols: 3,
        moves: [],
        moveHistory: []
      }

      this._onCellClicked = this._onCellClicked.bind(this)
      this._generateEmptyMoves = this._generateEmptyMoves.bind(this)
      this._insertMove = this._insertMove.bind(this)
      this._checkWin = this._checkWin.bind(this)

      this.state.moves = this._generateEmptyMoves()
  }

  _reset() {
    this.setState({
      moves: this._generateEmptyMoves(),
      moveHistory: []
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
      console.log("Row Win!")
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
      console.log("Col Win!")
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
      console.log('Right diag win')
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
      console.log('Left diag win')
    }


  }

  _insertMove(row, col) {
    let moves = {
      ...this.state.moves
    }

    const currPlayer = "1"
    const currValue = "O"
    const move = {
        player: currPlayer,
        value: currValue,
        row: row,
        col: col
    }

    moves[row][col] = move

    this.setState({
      moves: moves,
      moveHistory: this.state.moveHistory.concat([
        move
      ])
    }, () => {
      this._checkWin(move, this.state.moves)
    })
  }

  render() {
    return (
      <div className='tic-tac-toe'>
        <Board
          rows={this.state.rows}
          cols={this.state.cols}
          moves={this.state.moves}
          onCellClicked={this._onCellClicked}/>
      </div>
    )
  }
}

export default TicTacToe
