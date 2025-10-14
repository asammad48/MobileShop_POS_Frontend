import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Sale {
  id: string;
  customer: string;
  items: string;
  total: number;
  date: string;
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
    <Card>
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Last Sales</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onViewAll}
          data-testid="button-view-all-sales"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                <TableCell className="font-medium">{sale.customer}</TableCell>
                <TableCell className="text-muted-foreground">{sale.items}</TableCell>
                <TableCell className="font-semibold">${sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-sm">{sale.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
