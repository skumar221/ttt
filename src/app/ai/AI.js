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
