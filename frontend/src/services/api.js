// API Service for ToneShift

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Sends a rewrite request to the FastAPI backend.
 * @param {string} text - The original text to rewrite.
 * @param {string} tone - The target tone (e.g., 'Formal', 'Casual').
 * @returns {Promise<Object>} The backend API response.
 */
export async function rewriteText(text, tone) {
  const url = `${API_BASE_URL}/api/rewrite`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, tone }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `Server returned status ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
