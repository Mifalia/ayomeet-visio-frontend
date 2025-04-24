/**
 * Removes all non-alphanumeric characters from the string and replaces spaces with hyphens.
 * This function ensures that the result can be safely used in URLs.
 * @param str - The string to format.
 * @returns A sanitized string with only lowercase letters, numbers, and hyphens.
 */
function sanitizeForUrl(str: string): string {
  return str
    .toLowerCase() // Convert to lowercase first
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks (accents, etc.)
    .replace(/[^a-z0-9\s-]/g, '') // Remove any character that's not a letter, number, space, or hyphen
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Generates a unique room name by formatting the input string and appending a short hash.
 * The input room name is sanitized for URL usage (spaces become hyphens, special chars removed),
 * and a 6-character hash is appended to ensure uniqueness.
 *
 * @param roomName - The user-provided room name to format and make unique.
 * @returns A unique formatted room name with a short hash appended.
 */
export function generateRoomName(roomName: string): string {
  const sanitizedRoomName = sanitizeForUrl(roomName.trim());
  const hash = Math.random().toString(36).substring(2, 8);
  return `${sanitizedRoomName}-${hash}`;
}

/**
 * Validates a room name to ensure it meets formatting rules.
 * A valid room name contains only lowercase letters, numbers, and hyphens,
 * does not start or end with a hyphen, has no consecutive hyphens,
 * and is between 3 and 100 characters long.
 *
 * @param roomName - The room name to validate.
 * @returns True if the room name is valid, false otherwise.
 */
export function isValidRoomName(roomName: string): boolean {
  const trimmed = roomName.trim();
  const validPattern = /^(?!-)(?!.*--)[a-z0-9-]{3,100}(?<!-)$/;
  return validPattern.test(trimmed);
}
