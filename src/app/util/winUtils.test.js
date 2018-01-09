import React from 'react'
import * as winUtils from './winUtils.js'

describe('winUtils', () => {
	describe('getWinnerBySum', () => {
		it('should return ai enum when sum is 3', () => {
			expect(winUtils.getWinnerBySum(3)).toEqual(winUtils.AI)
		})
		it('should return human enum when sum is -3', () => {
			expect(winUtils.getWinnerBySum(-3)).toEqual(winUtils.HUMAN)
		})
		it('should return null when the sum is something other than +/- 3', () => {
			expect(winUtils.getWinnerBySum(1)).toEqual(null)
		})
	})


	describe('checkWinner', () => {
		it('shouldReturn appropriate winners on winning boards', () => {
			expect(winUtils.checkWinner([[-1, 1, null], [-1, 1, null], [-1, null, null]]).winner).toBe(winUtils.HUMAN)
			expect(winUtils.checkWinner([[null, 1, -1], [null, -1, 1], [-1, null, null]]).winner).toBe(winUtils.HUMAN)

			expect(winUtils.checkWinner([[-1, -1, null], [1, 1, 1], [null, null, null]]).winner).toBe(winUtils.AI)
			expect(winUtils.checkWinner([[1, -1, null], [null, 1, -1], [null, null, 1]]).winner).toBe(winUtils.AI)

			expect(winUtils.checkWinner([[1, 1, -1], [-1, -1, 1], [1, -1, 1]]).winner).toBe(winUtils.DRAW)

			expect(winUtils.checkWinner([[null, null, null], [null, null, null], [null, null, null]]).winner).toBe(null)
			expect(winUtils.checkWinner([[1, null, null], [null, -1, null], [null, null, null]]).winner).toBe(null)
		})
	})
})
