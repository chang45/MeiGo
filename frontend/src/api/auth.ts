import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  StoredUser,
  User,
} from '../types/auth';

export const DEMO_ACCOUNTS: StoredUser[] = [
  { id: 'demo-consumer', username: 'consumer', password: '123456', nickname: '美食探索家', role: 'consumer' },
  { id: 'demo-merchant', username: 'merchant', password: '123456', nickname: '示例商家', role: 'merchant' },
  { id: 'demo-rider', username: 'rider', password: '123456', nickname: '闪送骑手', role: 'rider' },
  { id: 'demo-admin', username: 'admin', password: 'admin123', nickname: '平台管理员', role: 'admin' },
];

function toUser({ password: _password, ...user }: StoredUser): User {
  return user;
}

function createResult(storedUser: StoredUser): AuthResult {
  return {
    user: toUser(storedUser),
    token: `mock-${storedUser.id}-${Date.now()}`,
  };
}

export async function login(input: LoginInput, customUsers: StoredUser[] = []): Promise<AuthResult> {
  const storedUser = [...DEMO_ACCOUNTS, ...customUsers].find(
    (candidate) => candidate.username === input.username && candidate.password === input.password,
  );

  if (!storedUser) {
    throw new Error('用户名或密码错误');
  }

  return createResult(storedUser);
}

export async function register(
  input: RegisterInput,
  customUsers: StoredUser[] = [],
): Promise<{ result: AuthResult; storedUser: StoredUser }> {
  const role: string = input.role;
  if (role === 'admin') {
    throw new Error('管理员账号不能通过注册创建');
  }

  const usernameExists = [...DEMO_ACCOUNTS, ...customUsers].some(
    (candidate) => candidate.username === input.username,
  );

  if (usernameExists) {
    throw new Error('用户名已存在');
  }

  const storedUser: StoredUser = {
    id: `local-${Date.now()}`,
    username: input.username,
    password: input.password,
    nickname: input.nickname?.trim() || input.username,
    role: input.role,
  };

  return { result: createResult(storedUser), storedUser };
}
