import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sales_person';
  shopId?: string;
  shopName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  signup: (username: string, email: string, password: string, role: string) => boolean;
  logout: () => void;
}

// Mock users for demo //todo: remove mock functionality
const mockUsers = [
  { id: '1', username: 'superadmin', password: 'admin123', email: 'super@admin.com', role: 'super_admin' as const },
  { id: '2', username: 'admin', password: 'admin123', email: 'admin@shop.com', role: 'admin' as const, shopId: 'shop1', shopName: 'TechFix Mobile Repair' },
  { id: '3', username: 'sales', password: 'sales123', email: 'sales@shop.com', role: 'sales_person' as const, shopId: 'shop1', shopName: 'TechFix Mobile Repair' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (username: string, password: string) => {
        //todo: remove mock functionality
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            token: 'mock-jwt-token-' + user.id, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },
      signup: (username: string, email: string, password: string, role: string) => {
        //todo: remove mock functionality
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          email,
          role: role as 'super_admin' | 'admin' | 'sales_person',
          shopId: role === 'admin' || role === 'sales_person' ? 'shop1' : undefined,
          shopName: role === 'admin' || role === 'sales_person' ? 'My Shop' : undefined,
        };
        set({ 
          user: newUser, 
          token: 'mock-jwt-token-' + newUser.id, 
          isAuthenticated: true 
        });
        return true;
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
