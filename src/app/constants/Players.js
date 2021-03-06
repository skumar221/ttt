export const HUMAN = -1
export const AI = 1
export const getOtherPlayer = p => p === AI ? HUMAN : AI

export const asObj = {
  [HUMAN]: {
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
