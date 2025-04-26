// Simple utility functions for mathematical operations

/**
 * Calculates factorial of a number
 */
export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

/**
 * Calculates the combination (n choose k)
 */
export const combination = (n: number, k: number): number => {
  return factorial(n) / (factorial(k) * factorial(n - k));
};

/**
 * Calculates the permutation of n elements taken k at a time
 */
export const permutation = (n: number, k: number): number => {
  return factorial(n) / factorial(n - k);
};

/**
 * Calculates the mean of an array of numbers
 */
export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

/**
 * Calculates the median of an array of numbers
 */
export const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Calculates the mode of an array of numbers
 */
export const mode = (values: number[]): number[] => {
  if (values.length === 0) return [];
  
  const counts = new Map<number, number>();
  let maxCount = 0;
  
  // Count occurrences of each value
  for (const value of values) {
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    maxCount = Math.max(maxCount, count);
  }
  
  // Find all values that appear the maximum number of times
  const modes: number[] = [];
  for (const [value, count] of counts.entries()) {
    if (count === maxCount) {
      modes.push(value);
    }
  }
  
  return modes;
};

/**
 * Calculates the standard deviation of an array of numbers
 */
export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const variance = mean(squareDiffs);
  
  return Math.sqrt(variance);
};

/**
 * Calculates the variance of an array of numbers
 */
export const variance = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  
  return mean(squareDiffs);
};

/**
 * Formats a number to a specified number of decimal places
 */
export const formatNumber = (num: number, decimals: number = 4): string => {
  return num.toFixed(decimals).replace(/\.?0+$/, '');
};

/**
 * Parses a string of comma-separated numbers into an array of numbers
 */
export const parseNumberArray = (input: string): number[] => {
  if (!input.trim()) return [];
  
  return input
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(Number)
    .filter(num => !isNaN(num));
};