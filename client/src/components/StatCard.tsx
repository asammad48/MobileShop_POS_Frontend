import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, gradient = 'from-primary to-accent' }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
      <div className={`p-6 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
        <div className="relative flex items-center justify-between text-white">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-7 h-7" />
          </div>
          {trend && (
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
              trend.isPositive ? 'bg-green-500/30' : 'bg-red-500/30'
            } backdrop-blur-sm`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
      <div className="p-6 bg-card">
        <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{title}</div>
      </div>
    </Card>
  );
}
