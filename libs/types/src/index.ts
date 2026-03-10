export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'blocked';
export type ContentStatus = 'published' | 'hidden' | 'deleted' | 'under_review';

export interface SessionUser {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
}
