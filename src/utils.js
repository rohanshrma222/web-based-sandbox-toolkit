const isValidNumber = (n) => typeof n === 'number' && !isNaN(n);

export function validatePosition(position) {
  if (!position || typeof position !== 'object') {
    return false;
  }

  const { x, y, z } = position;
  return isValidNumber(x) && isValidNumber(y) && isValidNumber(z);
}

export function calculateDistance(pos1, pos2) {
  const squaredDistance = ['x', 'y', 'z'].reduce(
    (sum, axis) => sum + (pos2[axis] - pos1[axis]) ** 2,
    0
  );
  return Math.sqrt(squaredDistance);
}

export function getSceneBounds(objects) {
  if (!objects?.length) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
  }

  const positions = objects.map((obj) => obj.position);
  
  return ['x', 'y', 'z'].reduce((bounds, axis) => {
    const coords = positions.map((p) => p[axis]);
    bounds[`min${axis.toUpperCase()}`] = Math.min(...coords);
    bounds[`max${axis.toUpperCase()}`] = Math.max(...coords);
    return bounds;
  }, {});
}

export function isWithinBounds(position, bounds) {
  return ['x', 'y', 'z'].every(
    (axis) => position[axis] >= bounds[`min${axis.toUpperCase()}`] &&
              position[axis] <= bounds[`max${axis.toUpperCase()}`]
  );
}
