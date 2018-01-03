import { checkWinner } from '../util/checkWinner.js'

export const easy = state => {
  let row = 0, col = 0
  const board = state.board
  let emptyMoves = []

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) {
        emptyMoves.push({
          row: i,
          col: j
        })
      }
    }
  }

  return emptyMoves[Math.floor(Math.random() * emptyMoves.length)]
}


export const hard = state => {
    numNodes = 0
    let board = recurseMinimax(state.moves, true)[1]
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === true) {
          return {
            row: i,
            col: j
          }
        }
      }
    }

    throw("it shouldn't get here!")
}


var numNodes = 0;

function recurseMinimax(board, player) {
  numNodes++;

  var winner = checkWinner(board, 3, 3);

  if (winner != null) {
      switch(winner) {
          case 1:
              // AI wins
              return [1, board]
          case 0:
              // opponent wins
              return [-1, board]
          case -1:
              // Tie
              return [0, board]
      }
  } else {
    // Next states
    let nextVal = null
    let nextBoard = null

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {

            if (board[i][j] === null) {
                board[i][j] = player
                let value = recurseMinimax(board, !player)[0]
                if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                    nextBoard = board.map(r => [...r])
                    nextVal = value
                }
                board[i][j] = null
            }
        }
    }

    return [nextVal, nextBoard];
  }
}
