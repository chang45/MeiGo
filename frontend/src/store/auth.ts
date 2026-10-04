import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';
import type { LoginInput, RegisterInput, StoredUser, User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  customUsers: StoredUser[];
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      customUsers: [],
      async login(input) {
        const result = await authApi.login(input, get().customUsers);
        set({ user: result.user, token: result.token });
        return result.user;
      },
      async register(input) {
        const { result, storedUser } = await authApi.register(input, get().customUsers);
        set({
          user: result.user,
          token: result.token,
          customUsers: [...get().customUsers, storedUser],
        });
        return result.user;
      },
      logout() {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'meigo-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        customUsers: state.customUsers,
      }),
    },
  ),
);
