import { checkWinner } from '../util/checkWinner.js'
import * as Players from '../constants/Players.js'

export const easy = board => {
  let row = 0, col = 0
  let emptyMoves = []
  console.log(board)
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      console.log(board[i][j])
      if (board[i][j] === null) {
        emptyMoves.push({
          row: i,
          col: j
        })
      }
    }
  }

  return emptyMoves[Math.floor(Math.random() * emptyMoves.length)]
}


export const hard = moves => {
    let board = recurseMinimax(moves, true)[1]
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


function recurseMinimax(board, player) {
  let winner = checkWinner(board, 3, 3)

  if (winner != null) {
      switch(winner) {
          case 1:
              // AI wins
              return [1, board]
          case 0:
              // Tie
              return [0, board]
          case -1:
              // opponent wins
              return [-1, board]
      }
  } else {
    // Next states
    let nextVal = null, nextBoard = null

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {

            if (board[i][j] === null) {
                board[i][j] = player
                let value = recurseMinimax(board, Players.getOtherPlayer(player))[0]
                if ((player && (nextVal == null || value > nextVal)) ||
                  (!player && (nextVal == null || value < nextVal))) {
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
