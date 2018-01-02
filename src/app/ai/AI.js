export const easy = state => {
  let row = 0, col = 0
  const moves = state.moves
  let emptyMoves = []

  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (!moves[i][j]) {
        emptyMoves.push({
          row: i,
          col: j
        })
      }
    }
  }

  return emptyMoves[Math.floor(Math.random() * emptyMoves.length)]
}



var numNodes = 0;

function recurseMinimax(moves, player) {
  numNodes++;

  var winner = getWinner(board);

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
    let nextVal = null;
    let nextBoard = null;
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
            if (moves[i][j] === null) {
                moves[i][j] = player
                let value = recurseMinimax(moves, !player)[0]
                if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                    nextBoard = moves.map(r => [...r])
                    nextVal = value
                }
                moves[i][j] = null
            }
        }
    }
    return [nextVal, nextBoard];
  }


export const hard = state => {
    numNodes = 0
    let moves = recurseMinimax([...state.moves], true)[1]
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        if (moves[i][j] === true) {
          return {
            row: i,
            col: j
          }
        }
      }
    }

    throw("it shouldn't get here!")
}
