import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Store } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-2/10 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold text-center mb-2">POS System</h1>
        <p className="text-center text-muted-foreground mb-6">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              data-testid="input-username"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              data-testid="input-password"
            />
          </div>
          
          <Button type="submit" className="w-full" data-testid="button-login">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo Accounts:</p>
          <p className="mt-2">Super Admin: <span className="font-mono">superadmin / admin123</span></p>
          <p>Admin: <span className="font-mono">admin / admin123</span></p>
          <p>Sales: <span className="font-mono">sales / sales123</span></p>
        </div>
      </Card>
    </div>
  );
}
