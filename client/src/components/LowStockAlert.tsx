import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minRequired: number;
  category: string;
}

interface LowStockAlertProps {
  items?: StockItem[];
}

export default function LowStockAlert({ items: propItems }: LowStockAlertProps) {
  //todo: remove mock functionality
  const mockItems: StockItem[] = [
    { id: 'P001', name: 'iPhone 13 Screen', currentStock: 2, minRequired: 5, category: 'Screen Repairs' },
    { id: 'P002', name: 'Samsung Battery', currentStock: 1, minRequired: 5, category: 'Battery' },
    { id: 'P003', name: 'Wireless Charger', currentStock: 0, minRequired: 5, category: 'Accessories' },
    { id: 'P004', name: 'USB-C Cable', currentStock: 3, minRequired: 10, category: 'Cables' },
  ];

  const items = propItems || mockItems;

  return (
    <Card>
      <div className="p-4 border-b flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="font-semibold">Low Generic Stock</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Required</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell>
                  <span className={item.currentStock === 0 ? 'text-destructive font-semibold' : ''}>
                    {item.currentStock} units
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.minRequired} units</TableCell>
                <TableCell>
                  <Badge variant={item.currentStock === 0 ? 'destructive' : 'secondary'}>
                    {item.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
