export const SESSION_COOKIE_NAME = 'vic_session';

export function isModerator(role: string): boolean {
  return role === 'moderator' || role === 'admin';
}
