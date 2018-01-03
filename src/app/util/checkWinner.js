import _ from 'lodash'
import {winBySum, DRAW} from './winEnums.js'


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
        return winBySum(sum)
      }
    }
  }

  // check rows
  for (let i = 0; i < rows; i++) {
    let sum = 0
    for (let j = 0; j < cols; j++) {
      sum += board[i][j]
      if (Math.abs(sum) === rows) {
        return winBySum(sum)
      }
    }
  }

  // check \ diagonal
  for (let i = 0; i < rows; i++) {
    let sum = 0
    sum += board[i][i]
    if (Math.abs(sum) === rows) {
      return winBySum(sum)
    }
  }

  // check / diagonal
  for (let i = 0; i < rows; i++) {
    let sum = 0
    sum += board[rows - 1 - i][i]
    if (Math.abs(sum) === rows) {
      return winBySum(sum)
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
