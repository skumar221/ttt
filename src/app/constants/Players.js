export const PLAYER = -1
export const AI = 1
export const getOtherPlayer = p => p === AI ? PLAYER : AI
