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
    <Card className="shadow-lg border-0">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Low Stock Alert</h3>
          <p className="text-sm text-muted-foreground">Items requiring restock</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Current Stock</TableHead>
              <TableHead className="font-semibold">Min Required</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isOutOfStock = item.currentStock === 0;
              const stockPercentage = (item.currentStock / item.minRequired) * 100;
              
              return (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.currentStock}
                      </span>
                      <span className="text-muted-foreground text-sm">units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.minRequired} units</TableCell>
                  <TableCell>
                    <Badge 
                      variant={isOutOfStock ? 'destructive' : 'secondary'} 
                      className={`rounded-lg ${!isOutOfStock && 'bg-amber-100 text-amber-700 border-amber-300'}`}
                    >
                      {isOutOfStock ? '⚠️ Out of Stock' : '📉 Low Stock'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
