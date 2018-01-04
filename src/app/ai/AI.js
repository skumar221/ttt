import { checkWinner, winTypes } from '../util/winUtils.js'
import * as players from '../constants/players.js'
import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'

export const easy = nextMoves => {
  let row = 0, col = 0
  let emptyMoves = []
  //console.log(nextMoves)
  for (let i = 0; i < nextMoves.length; i++) {
    for (let j = 0; j < nextMoves[i].length; j++) {
      //console.log(nextMoves[i][j])
      if (nextMoves[i][j] === null) {
        emptyMoves.push({
          row: i,
          col: j
        })
      }
    }
  }

  return emptyMoves[Math.floor(Math.random() * emptyMoves.length)]
}

const print2d = a => {
  let print = ''
  const plrs = players.asObj
  a.forEach(r => {
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

export const play = (moves, difficulty) => {
  const mm = recurseMinimax(moves.map(r => [...r]), players.AI, difficulty)
  const nextMoves = mm[1]



  //console.log("\nmoves")
  //print2d(moves)
  //console.log("nextMoves")
  //print2d(nextMoves)

  for (let i = 0; i < nextMoves.length; i++) {
    for (let j = 0; j < nextMoves[i].length; j++) {
      if (moves[i][j] !== nextMoves[i][j]) {
        console.log("diff", i, j)
        return {
          row: i,
          col: j
        }
      }
    }
  }

  //console.log("iet shouldnt get here")

    //throw("it shouldn't get here!")
}


function recurseMinimax(nextMoves, player, difficulty=EASY) {
  const winner = checkWinner(nextMoves, 3, 3)

  if (winner != null) {
    //print2d(nextMoves)
    //console.log("\treturning winner", winner)

    switch(winner) {
      case winTypes.AI:
          // AI wins
          return [1, nextMoves]
      case winTypes.PLAYER:
          // opponent wins
          return [-1, nextMoves]
      case winTypes.DRAW:
          // Tie
          return [0, nextMoves]
    }
  } else {
    // Next states
    let nextVal = null, nextBoard = null
    //(nextMoves)

    for (let i = 0; i < nextMoves.length; i++) {
      for (let j = 0; j < nextMoves[i].length; j++) {

            if (nextMoves[i][j] === null) {
                nextMoves[i][j] = player

                let b = recurseMinimax(nextMoves, players.getOtherPlayer(player))
                //console.log("result:")
                //print2d(b[1])

                let value = b[0]

                switch(difficulty) {
                  case HARD:
                    console.log("hard")
                    if ((player === players.AI && (nextVal == null || value > nextVal)) ||
                      (player === players.PLAYER && (nextVal == null || value < nextVal))) {
                        //console.log("player", player)
                        //console.log("value", value)
                        nextBoard = nextMoves.map(r => [...r])
                        nextVal = value
                    }
                    break
                  case MEDIUM:
                    if ((player === players.AI && (nextVal == null || value != nextVal)) ||
                      (player === players.PLAYER && (nextVal == null || value != nextVal))) {
                        nextBoard = nextMoves.map(r => [...r])
                        nextVal = value
                    }
                    break
                  case EASY:
                    if ((player === players.AI && (nextVal == null || value < nextVal)) ||
                      (player === players.PLAYER && (nextVal == null || value > nextVal))) {
                        nextBoard = nextMoves.map(r => [...r])
                        nextVal = value
                    }
                    break
                }

                nextMoves[i][j] = null
            }
        }
    }

    //console.log("returning", nextVal, nextBoard)
    //console.log("\n")
    return [nextVal, nextBoard];
  }
}
