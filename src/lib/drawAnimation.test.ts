import { describe, expect, test } from 'bun:test';
import { getAddedDraws, getDrawTiming } from './drawAnimation';

describe('external draw animation', () => {
  test('every new selection is detected beyond the sixth draw', () => {
    for (let number = 1; number <= 12; number++) {
      const previous = Array.from({ length: number - 1 }, (_, index) => index + 1);
      expect(getAddedDraws(previous, [...previous, number])).toEqual([number]);
    }
  });
  test('duplicate state deliveries and drawing-status updates do not replay a draw', () => {
    expect(getAddedDraws([1, 2, 3], [1, 2, 3])).toEqual([]);
  });
  test('replacement at the same count is detected and unchecking is not a new draw', () => {
    expect(getAddedDraws([1, 2], [1, 3])).toEqual([3]);
    expect(getAddedDraws([1, 2], [1])).toEqual([]);
  });
  test('closely spaced selections are retained in order', () => {
    expect(getAddedDraws([1], [1, 2, 3, 4])).toEqual([2, 3, 4]);
  });
  for (const duration of [2, 4, 6, 8, 10]) {
    test(`the enlarged ball stays still for exactly ${duration} seconds, excluding travel`, () => {
      const timing = getDrawTiming(duration);
      expect(timing.holdMs).toBe(duration * 1000);
      expect((timing.holdEnd - timing.holdStart) * timing.totalMs).toBeCloseTo(duration * 1000);
      expect(timing.totalMs).toBe(duration * 1000 + 1300);
    });
  }
});