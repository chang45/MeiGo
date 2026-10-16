import http, { errorMessage, type ApiEnvelope, unwrap } from './http';
import type { AuthResult, LoginInput, RegisterInput, StoredUser } from '../types/auth';

export const DEMO_ACCOUNTS: StoredUser[] = [
  { id: 1, username: 'consumer', password: '123456', nickname: '美食探索家', role: 'consumer' },
  { id: 2, username: 'merchant', password: '123456', nickname: '示例商家', role: 'merchant' },
  { id: 3, username: 'rider', password: '123456', nickname: '闪送骑手', role: 'rider' },
  { id: 4, username: 'admin', password: 'admin123', nickname: '平台管理员', role: 'admin' },
];

export async function login(input: LoginInput): Promise<AuthResult> {
  try {
    const response = await http.post<ApiEnvelope<AuthResult>>('/auth/login', input);
    return unwrap(response);
  } catch (error) {
    throw new Error(errorMessage(error));
  }
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  try {
    const response = await http.post<ApiEnvelope<AuthResult>>('/auth/register', input);
    return unwrap(response);
  } catch (error) {
    throw new Error(errorMessage(error));
  }
}
