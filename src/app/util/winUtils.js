import _ from 'lodash'

export const DRAW = 0
export const AI = 1
export const PLAYER = -1

export const winTypes = {
  DRAW,
  AI,
  PLAYER,
}

export const getWinnerBySum = sum => {
  switch (sum) {
    case -3:
      return PLAYER
    case 3:
      return AI
  }
}

/**
*
* @return {number | null}
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
