import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

type Period = 'weekly' | 'monthly' | 'yearly' | 'custom';

interface SalesAnalyticsChartProps {
  data?: any[];
}

export default function SalesAnalyticsChart({ data: propData }: SalesAnalyticsChartProps) {
  const [period, setPeriod] = useState<Period>('weekly');

  //todo: remove mock functionality
  const mockData = {
    weekly: [
      { date: 'Mon', sales: 4200, profit: 1200 },
      { date: 'Tue', sales: 3800, profit: 1100 },
      { date: 'Wed', sales: 5200, profit: 1800 },
      { date: 'Thu', sales: 4600, profit: 1400 },
      { date: 'Fri', sales: 6200, profit: 2200 },
      { date: 'Sat', sales: 7100, profit: 2800 },
      { date: 'Sun', sales: 5400, profit: 1900 },
    ],
    monthly: [
      { date: 'Week 1', sales: 18200, profit: 5400 },
      { date: 'Week 2', sales: 22100, profit: 6800 },
      { date: 'Week 3', sales: 19800, profit: 5900 },
      { date: 'Week 4', sales: 25300, profit: 7600 },
    ],
    yearly: [
      { date: 'Jan', sales: 45000, profit: 12000 },
      { date: 'Feb', sales: 52000, profit: 15000 },
      { date: 'Mar', sales: 48000, profit: 13500 },
      { date: 'Apr', sales: 61000, profit: 18000 },
      { date: 'May', sales: 55000, profit: 16000 },
      { date: 'Jun', sales: 67000, profit: 20000 },
    ],
    custom: [
      { date: 'Day 1', sales: 5200, profit: 1600 },
      { date: 'Day 2', sales: 4800, profit: 1400 },
      { date: 'Day 3', sales: 6100, profit: 1900 },
      { date: 'Day 4', sales: 5600, profit: 1700 },
      { date: 'Day 5', sales: 7200, profit: 2300 },
    ],
  };

  const data = propData || mockData[period];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Sales Analytics</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={period === 'weekly' ? 'default' : 'outline'}
            onClick={() => setPeriod('weekly')}
            data-testid="button-period-weekly"
          >
            Weekly
          </Button>
          <Button
            size="sm"
            variant={period === 'monthly' ? 'default' : 'outline'}
            onClick={() => setPeriod('monthly')}
            data-testid="button-period-monthly"
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={period === 'yearly' ? 'default' : 'outline'}
            onClick={() => setPeriod('yearly')}
            data-testid="button-period-yearly"
          >
            Yearly
          </Button>
          <Button
            size="sm"
            variant={period === 'custom' ? 'default' : 'outline'}
            onClick={() => setPeriod('custom')}
            data-testid="button-period-custom"
          >
            Custom
          </Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            name="Sales Amount"
            dot={{ fill: 'hsl(var(--chart-3))' }}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="hsl(var(--chart-4))" 
            strokeWidth={2}
            name="Profit Amount"
            dot={{ fill: 'hsl(var(--chart-4))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
