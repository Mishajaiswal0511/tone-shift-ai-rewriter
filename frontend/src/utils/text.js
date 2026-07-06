// Text Analysis Utilities

/**
 * Counts the number of words in a given text.
 * Handles double spaces, newlines, and trailing spaces correctly.
 * @param {string} text 
 * @returns {number} Word count
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const cleanText = text.trim();
  if (cleanText === '') return 0;
  return cleanText.split(/\s+/).length;
}

/**
 * Calculates the estimated reading time in seconds.
 * Assumes an average reading speed of 200 words per minute.
 * @param {string} text 
 * @returns {number} Reading time in seconds
 */
export function calculateReadingTime(text) {
  const wordCount = countWords(text);
  if (wordCount === 0) return 0;
  // 200 words per minute = 3.33 words per second
  const wordsPerSecond = 200 / 60;
  return Math.ceil(wordCount / wordsPerSecond);
}

/**
 * Formats reading time into a user-friendly string.
 * @param {number} seconds 
 * @returns {string} E.g., "12s" or "1m 15s"
 */
export function formatReadingTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}
