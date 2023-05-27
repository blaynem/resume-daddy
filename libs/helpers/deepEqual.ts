export const deepEqual = (a: any, b: any): boolean => {
  // Check if the types of a and b are different
  if (typeof a !== typeof b) {
    return false;
  }

  // If a and b are primitive types, perform a strict equality check
  if (typeof a !== 'object' || a === null || b === null) {
    return a === b;
  }

  // Check if a and b are arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  // Check if a and b are objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  // If none of the above conditions are met, a and b are considered different
  return false;
};
