import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    
    if (success) {
      const currentUser = useAuthStore.getState().user;
      toast({
        title: 'Login successful',
        description: `Welcome back, ${username}!`,
      });
      
      if (currentUser?.role === 'super_admin') {
        setLocation('/super-admin/dashboard');
      } else if (currentUser?.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (currentUser?.role === 'sales_person') {
        setLocation('/pos');
      }
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      
      <Card className="w-full max-w-md p-10 shadow-2xl border-0 backdrop-blur-sm bg-white/90 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          POS System
        </h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to access your dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="h-12 rounded-xl border-2 focus-visible:ring-purple-500"
              data-testid="input-username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="h-12 rounded-xl border-2 focus-visible:ring-purple-500"
              data-testid="input-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50" 
            data-testid="button-login"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <p className="text-center text-sm font-semibold text-foreground mb-3">Demo Accounts</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Super Admin:</span>
              <code className="px-2 py-1 bg-white rounded-lg text-xs font-mono">superadmin / admin123</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Admin:</span>
              <code className="px-2 py-1 bg-white rounded-lg text-xs font-mono">admin / admin123</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sales:</span>
              <code className="px-2 py-1 bg-white rounded-lg text-xs font-mono">sales / sales123</code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
