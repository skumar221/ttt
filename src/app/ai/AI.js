import { checkWinner, winTypes } from '../util/winUtils.js'
import * as players from '../constants/players.js'

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
  a.forEach(r => {
    let line = ''
    r.forEach(c => {
      line += c + ' '
    })
    line += '\n'
    print += line
  })
  console.log(print)
}

export const hard = moves => {
  const mm = recurseMinimax(moves.map(r => [...r]), players.AI)
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


function recurseMinimax(nextMoves, player) {
  const winner = checkWinner(nextMoves, 3, 3)
  //console.log(winner)

  if (winner != null) {
    //console.log("\nwinner", winner)
    //print2d(nextMoves)
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

    for (let i = 0; i < nextMoves.length; i++) {
      for (let j = 0; j < nextMoves[i].length; j++) {

            if (nextMoves[i][j] === null) {
                nextMoves[i][j] = player

                let b = recurseMinimax(nextMoves, players.getOtherPlayer(player))
                //print2d(b[1])

                let value = b[0]

                // hard
                
                if ((player === players.AI && (nextVal == null || value > nextVal)) ||
                  (player === players.PLAYER && (nextVal == null || value < nextVal))) {
                    nextBoard = nextMoves.map(r => [...r])
                    nextVal = value
                }


                // easy

                /*
                if ((player === players.AI && (nextVal == null || value < nextVal)) ||
                  (player === players.PLAYER && (nextVal == null || value > nextVal))) {
                    nextBoard = nextMoves.map(r => [...r])
                    nextVal = value
                }
                */

                nextMoves[i][j] = null
            }
        }
    }

    return [nextVal, nextBoard];
  }
}
