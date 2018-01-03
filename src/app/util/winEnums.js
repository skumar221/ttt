export const DRAW = 0
export const AI_WIN = 1
export const PLAYER_WIN = -1

export const winBySum = sum => {
  switch (sum) {
    case -3:
      return AI_WIN
    case 3:
      return PLAYER_WIN
  }
}
