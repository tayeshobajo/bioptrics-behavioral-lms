export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

export const config = {
  apiUrl: API_URL,
  appName: 'TeamSynerG Programs',
} as const;
