/**
 * Generate persistent color for a user ID
 * Uses hash-based algorithm to ensure same color across sessions
 */

export function getUserColor(userId: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate pastel color with good contrast
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
  const lightness = 70 + (Math.abs(hash) % 15); // 70-85%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get a darker version for borders/accents
 */
export function getUserColorDark(userId: string): string {
  const baseColor = getUserColor(userId);
  // Extract HSL values and darken
  const match = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match) {
    const [, h, s, l] = match;
    const darkerL = Math.max(40, parseInt(l) - 20);
    return `hsl(${h}, ${s}%, ${darkerL}%)`;
  }
  return baseColor;
}

