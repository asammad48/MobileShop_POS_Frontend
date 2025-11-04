import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight, Receipt } from 'lucide-react';

interface Sale {
  id: string;
  customer: string;
  items: string;
  total: number;
  date: string;
  title: string
}

interface LastSalesProps {
  sales?: Sale[];
  onViewAll?: () => void;
}

export default function LastSales({ sales: propSales, onViewAll }: LastSalesProps) {
  //todo: remove mock functionality
  const mockSales: Sale[] = [
    { id: 'S001', customer: 'John Doe', items: 'iPhone Screen, Battery', total: 135.49, date: '2024-10-14 14:30' },
    { id: 'S002', customer: 'Jane Smith', items: 'Phone Case, Charger', total: 28.98, date: '2024-10-14 13:15' },
    { id: 'S003', customer: 'Mike Johnson', items: 'Screen Protector', total: 9.99, date: '2024-10-14 12:45' },
    { id: 'S004', customer: 'Sarah Williams', items: 'Wireless Charger', total: 29.99, date: '2024-10-14 11:20' },
    { id: 'S005', customer: 'Tom Brown', items: 'USB-C Cable, Adapter', total: 22.98, date: '2024-10-14 10:30' },
  ];

  const sales = propSales || mockSales;

  return (
    <Card className="shadow-lg border-0">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Recent Sales</h3>
            <p className="text-sm text-muted-foreground">Latest transactions</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onViewAll}
          className="rounded-xl hover-elevate"
          data-testid="button-view-all-sales"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-muted/20">
                <TableCell className="font-mono text-sm font-medium">{sale.id}</TableCell>
                <TableCell className="font-semibold">{sale.customer}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{sale.items}</TableCell>
                <TableCell className="font-bold text-emerald-600">${sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{sale.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
