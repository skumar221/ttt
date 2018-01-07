import _ from 'lodash'

export const DRAW = 0
export const AI = 1
export const HUMAN = -1

export const winTypes = {
  DRAW,
  AI,
  HUMAN,
}

/**
* Returns the winner based on a given sum of a row, col or diagonal
*
* @param {number} sum
*
* @return {number | null} the enumerated winner
*/
export const getWinnerBySum = sum => {
  switch (sum) {
    case -3:
      return HUMAN
    case 3:
      return AI
    default:
      return null
  }
}

/**
* Checks the winner of a board using the enumerated values of players (AI or human).
* Returns a number representation of who whon using the 'getWinnerBySum' method above.
* If it's a draw, returns the DRAW enumeration.  If no winner yet, returns null.
*
* @param {array<array<number | null>>} board
* @param {number} rows
* @param {number} cols
*
* @return {number | null} The enumerated player who won (AI or human),
*   DRAW enumeration, or null for no winner yet.
*/
export const checkWinner = (board, rows=3, cols=3) => {

  // check columns
  for (let j = 0; j < cols; j++) {
    let sum = 0
    for (let i = 0; i < rows; i++) {
      sum += board[i][j]
      if (Math.abs(sum) === rows) {
        return getWinnerBySum(sum)
      }
    }
  }

  // check rows
  for (let i = 0; i < rows; i++) {
    let sum = 0
    for (let j = 0; j < cols; j++) {
      sum += board[i][j]
      if (Math.abs(sum) === rows) {
        return getWinnerBySum(sum)
      }
    }
  }

  // check \ diagonal
  let sum = 0
  for (let i = 0; i < rows; i++) {
    sum += board[i][i]
    if (Math.abs(sum) === rows) {
      return getWinnerBySum(sum)
    }
  }

  // check / diagonal
  sum = 0
  for (let i = 0; i < rows; i++) {
    sum += board[rows - 1 - i][i]
    if (Math.abs(sum) === rows) {
      return getWinnerBySum(sum)
    }
  }

  // check draw
  let hasNull = false
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === null) {
        hasNull = true
      }
    }
  }

  if (!hasNull) {
    return DRAW
  }

  return null
}
