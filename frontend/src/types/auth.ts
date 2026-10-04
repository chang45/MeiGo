export type Role = 'consumer' | 'merchant' | 'rider' | 'admin';

export type SelfRegisterRole = Exclude<Role, 'admin'>;

export interface User {
  id: string;
  username: string;
  nickname: string;
  role: Role;
}

export interface StoredUser extends User {
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  nickname?: string;
  role: SelfRegisterRole;
}

export interface AuthResult {
  user: User;
  token: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  consumer: '消费者',
  merchant: '商家',
  rider: '骑手',
  admin: '平台管理员',
};

export const ROLE_HOME: Record<Role, string> = {
  consumer: '/',
  merchant: '/merchant',
  rider: '/rider',
  admin: '/admin',
};
