// Auth is now handled by Clerk (@clerk/nextjs).
// This file is kept for backwards compatibility of types only.
// Supabase is used for database operations only (not auth).

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface SessionData {
  admin: AdminUser;
}
