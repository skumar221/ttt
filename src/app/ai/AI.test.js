import React from 'react'
import * as AI from './AI.js'
import * as players from '../constants/players.js'
import { EASY, MEDIUM, HARD } from '../constants/difficultyLevels.js'


describe('AI', () => {
	describe('play', () => {
		it('should return a move favoring the player provided in the argument to win is in HARD mode', () => {
      // AI should win since it's the initial argument
      let result = AI.play([
        [1, -1, null],
        [1, -1, null],
        [null, null, null]
      ], HARD, players.AI)
			expect(result.row).toEqual(2)
      expect(result.col).toEqual(0)

      // Human should win since it's the initial argument
      result = AI.play([
        [-1, null, 1],
        [null, -1, 1],
        [null, null, null]
      ], HARD, players.HUMAN)
      expect(result.row).toEqual(2)
      expect(result.col).toEqual(2)
		})

    it('should return a move not favoring the player provided in EASY mode', () => {
      // AI
      let result = AI.play([
        [1, -1, null],
        [1, -1, null],
        [null, null, null]
      ], EASY, players.AI)
      expect(result.row).not.toEqual(2)
      expect(result.col).not.toEqual(0)

      // Human
      result = AI.play([
        [-1, null, 1],
        [null, -1, 1],
        [null, null, null]
      ], EASY, players.HUMAN)
      expect(result.row).not.toEqual(2)
      expect(result.col).not.toEqual(2)
    })

    it('should return undefined if the board is already a won', () => {
      // AI win
      let result = AI.play([
        [1, -1, null],
        [1, -1, null],
        [1, null, null]
      ], EASY, players.AI)
      expect(result).not.toBeDefined()

      // human win
      result = AI.play([
        [-1, 1, null],
        [-1, 1, null],
        [-1, null, null]
      ], EASY, players.AI)
      expect(result).not.toBeDefined()
    })

    it('should return undefined if the board is a draw', () => {
      let result = AI.play([
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1]
      ], EASY, players.AI)
      expect(result).not.toBeDefined()
    })
	})
})
