import { User } from './user.entity';
import { Database } from '../types/database.types';

type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * Convert a DB row (snake_case, created_at string) to GraphQL User shape
 */
export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

export function rowsToUsers(rows: UserRow[] | null | undefined): User[] {
  if (!rows) return [];
  return rows.map(rowToUser);
}

/**
 * Convert an Insert type (camelCase if used) to DB insert shape if needed.
 * For now we forward through since Supabase client accepts camelCase keys
 * if your DB column names are snake_case you may need to map explicitly.
 */
export function toInsert(row: Partial<User>): Partial<User> {
  // Minimal passthrough; expand if you need to map camelCase -> snake_case
  return {
    email: row.email,
    name: row.name,
  };
}

export default {
  rowToUser,
  rowsToUsers,
  toInsert,
};
