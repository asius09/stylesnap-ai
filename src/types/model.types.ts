export interface UserTrial {
  id: string; // UUID from the database
  ip: string | null;
  last_ip: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user_metadata: Record<string, any> | null; // Can hold browser, OS, etc.
  free_used: boolean;
  paid_credits: number;
  last_seen: string; // ISO timestamp
  created_at: string; // ISO timestamp
}
