import { describe, it, expect } from 'vitest';
import {
  validatePosition,
  calculateDistance,
  getSceneBounds,
  isWithinBounds
} from './utils.js';

describe('validatePosition', () => {
  it('should return true for valid position', () => {
    const position = { x: 0, y: 0, z: 0 };
    expect(validatePosition(position)).toBe(true);
  });

  it('should return true for position within bounds', () => {
    const position = { x: 2, y: 1, z: -1 };
    expect(validatePosition(position)).toBe(true);
  });

  it('should return false for position with missing coordinates', () => {
    const position = { x: 0, z: 0 };
    expect(validatePosition(position)).toBe(false);
  });

  it('should return false for position with non-numeric values', () => {
    const position = { x: 'a', y: 0, z: 0 };
    expect(validatePosition(position)).toBe(false);
  });
});

describe('calculateDistance', () => {
  it('should return 0 for same position', () => {
    const pos1 = { x: 1, y: 2, z: 3 };
    const pos2 = { x: 1, y: 2, z: 3 };
    expect(calculateDistance(pos1, pos2)).toBe(0);
  });

  it('should calculate correct distance between two points', () => {
    const pos1 = { x: 0, y: 0, z: 0 };
    const pos2 = { x: 3, y: 4, z: 0 };
    expect(calculateDistance(pos1, pos2)).toBe(5);
  });

  it('should calculate 3D distance correctly', () => {
    const pos1 = { x: 0, y: 0, z: 0 };
    const pos2 = { x: 1, y: 2, z: 2 };
    expect(calculateDistance(pos1, pos2)).toBe(3);
  });
});

describe('getSceneBounds', () => {
  it('should return bounds for empty objects array', () => {
    const objects = [];
    const bounds = getSceneBounds(objects);
    expect(bounds.minX).toBe(0);
    expect(bounds.maxX).toBe(0);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxY).toBe(0);
    expect(bounds.minZ).toBe(0);
    expect(bounds.maxZ).toBe(0);
  });

  it('should return correct bounds for multiple objects', () => {
    const objects = [
      { position: { x: -2, y: 0, z: -1 } },
      { position: { x: 3, y: 2, z: 4 } },
      { position: { x: 0, y: 1, z: -2 } },
    ];
    const bounds = getSceneBounds(objects);
    expect(bounds.minX).toBe(-2);
    expect(bounds.maxX).toBe(3);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxY).toBe(2);
    expect(bounds.minZ).toBe(-2);
    expect(bounds.maxZ).toBe(4);
  });
});

describe('isWithinBounds', () => {
  it('should return true when position is within bounds', () => {
    const position = { x: 0, y: 0, z: 0 };
    const bounds = { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -5, maxZ: 5 };
    expect(isWithinBounds(position, bounds)).toBe(true);
  });

  it('should return true for position on boundary', () => {
    const position = { x: 5, y: 5, z: 5 };
    const bounds = { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -5, maxZ: 5 };
    expect(isWithinBounds(position, bounds)).toBe(true);
  });

  it('should return false when position is outside bounds', () => {
    const position = { x: 10, y: 0, z: 0 };
    const bounds = { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -5, maxZ: 5 };
    expect(isWithinBounds(position, bounds)).toBe(false);
  });
});
