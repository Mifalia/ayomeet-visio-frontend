/**
 * Extracts the username from an email address.
 *
 * @param email - The email address from which to extract the username.
 * @returns The username portion of the email (everything before the '@' symbol).
 */
export const extractUsernameFromEmail = (email: string = ''): string | null => {
  if (!email.includes('@')) {
    return null;
  }

  return email.split('@')[0];
};

export const generateUserAvatar = (seed: string): string => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&radius=24&size=40`;
};
