import { checkWinner, winTypes } from '../util/winUtils.js'
import * as players from '../constants/players.js'
import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'

/**
* Utility method to print the board.
*
* @param {array<array<number>>} board
*/
const print2d = board => {
  let print = ''
  const plrs = players.asObj
  board.forEach(r => {
    let line = ''
    r.forEach(c => {
      // TODO make this more robust
      line += _.get(plrs, `${c}.symbol`, '_') + ' '
    })
    line += '\n'
    print += line
  })
  console.log(print)
}


/**
*
*
* @param {array<array<number>>} moves 2D array representing the board
* @param {number} difficulty
* @param {number} player
* @param {number} mistakeProbability The probability that
*/
export const play = (moves, difficulty, player=players.AI, mistakeProbability=0) => {

  const mm = recurseMinimax(moves.map(r => [...r]), player, difficulty, 0, mistakeProbability)
  console.log("minMax", mm)
  const nextMoves = mm[1]

  for (let i = 0; i < nextMoves.length; i++) {
    for (let j = 0; j < nextMoves[i].length; j++) {
      if (moves[i][j] !== nextMoves[i][j]) {
        return {
          row: i,
          col: j
        }
      }
    }
  }
}

/**
* The main minimax recursion function.  This is a vairation on the standard
* minimax algorithm used for TicTacToe AIs to handle difficulty levels and the
* introduction of a randomization seed such that a difficulty level of "HARD"
* is no impossible to win -- the computer will make mistakes an arbitrarily low
* percentage of the time.  The opposite holds true for EASY mode.
*
* @param {array<array<number>>} nextMoves 2D array representing the board
*   populated with 1s, -1s and nulls
* @param {number} player The player, either 1 (the AI) or -1 (the player)
* @param {number} difficulty The enumerated difficulty level
* @param {number} depth The depth tracker, to weight the win and minimize the
*   amount of moves
*/
function recurseMinimax(nextMoves, player, difficulty=difficultyLevels.EASY, depth=0, mistakeProbability=0) {

  const winner = checkWinner(nextMoves, 3, 3)

  if (winner != null) {
    if (winner > 0) { // Player wins
      return [10 - depth, nextMoves]
    } else if (winner < 0) { // Opponent wins
      return [depth - 10, nextMoves]
    } else { // Draw
      return [0, nextMoves]
    }
  } else {
    let nextVal = null, nextBoard = null

    for (let i = 0; i < nextMoves.length; i++) {
      for (let j = 0; j < nextMoves[i].length; j++) {

            if (nextMoves[i][j] === null) {
                nextMoves[i][j] = player

                const b = recurseMinimax(nextMoves, players.getOtherPlayer(player), difficulty, depth++, mistakeProbability)
                const value = b[0]
                const isMore = value > nextVal
                const isLess = value < nextVal
                const isNotEqual = value != nextVal

                const isMistake = mistakeProbability > 0 && (_.random(1, 1000) <= (mistakeProbability * 1000))

                if (isMistake) {
                  //console.log(`Mistake triggered! ${difficulty} is changing to:`)
                  switch(difficulty) {
                    case HARD:
                      difficulty = _.sample([EASY, MEDIUM])
                      break
                    case MEDIUM:
                      difficulty = _.sample([EASY, HARD])

                      break
                    case EASY:
                      difficulty = _.sample([MEDIUM, HARD])
                      break
                    default:
                      throw(`Invalid difficulty ${difficulty}`)
                  }
                  //console.log(`${difficulty}\n`)
                }

                let posPlayerGate, negPlayerGate

                // Boolean switching to accommodate difficulties
                switch(difficulty) {
                  case HARD:
                    /*
                    * In hard mode,  the intention is for the AI to win;
                    * we want the highest score for the positive player,
                    * and lowest score for the negative player
                    */
                    posPlayerGate = isMore
                    negPlayerGate = isLess
                    break
                  case MEDIUM:
                    /*
                    * In medium mode,
                    */
                    posPlayerGate = isNotEqual
                    negPlayerGate = isNotEqual
                    break
                  case EASY:
                    /*
                    * In easy mode, since the intention is for the AI to lose
                    * we want the lowest score for the positive player,
                    * and highest score for the negative player
                    */
                    posPlayerGate = isLess
                    negPlayerGate = isMore
                    break
                  default:
                    throw(`Invalid difficulty ${difficulty}`)
                }

                if ((player > 0 && (nextVal == null || posPlayerGate)) ||
                  (player < 0 && (nextVal == null || negPlayerGate))) {
                    nextBoard = nextMoves.map(r => [...r])
                    nextVal = value
                }

                nextMoves[i][j] = null
            }
        }
    }

    return [nextVal, nextBoard]
  }
}
