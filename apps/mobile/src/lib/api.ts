import Constants from 'expo-constants';

const API_PORT = 3000;

function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // In dev, hostUri is the Metro host (e.g. "192.168.1.10:8081"),
  // so a physical device in Expo Go can reach the local API.
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${API_PORT}`;
}

export const API_URL = resolveApiUrl();

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<HealthResponse>;
}
