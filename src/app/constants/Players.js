export const PLAYER = -1
export const AI = 1
export const getOtherPlayer = p => p === AI ? PLAYER : AI

export const asObj = {
  [PLAYER]: {
    name: 'Player',
    symbol: 'X',
    color: '#663399',
  },
  [AI]: {
    name: 'AI',
    symbol: 'O',
    color: '#3dd60d'
  }
}
