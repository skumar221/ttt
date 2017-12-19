import React from 'react'
import Board from '../functional-components/Board.jsx'

class TicTacToe extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        rows: 3,
        cols: 3,
        moves: [],
      }

      this._onCellClicked = this._onCellClicked.bind(this)
      this._generateEmptyMoves = this._generateEmptyMoves.bind(this)
      this._insertMove = this._insertMove.bind(this)

      this.state.moves = this._generateEmptyMoves()
  }

  _reset() {
    this.setState({
      moves: this._generateEmptyMoves()
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

  _insertMove(row, col) {
    console.log("insert move", row, col)
    let moves = {
      ...this.state.moves
    }

    console.log(moves)

    moves[row][col] = {
      player: "1",
      value: 'X'
    }

    this.setState({
      moves: moves
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
