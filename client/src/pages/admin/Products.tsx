import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Products() {
  useAuth('admin');
  const [products] = useState(mockProducts); //todo: remove mock functionality
  const { toast } = useToast();

  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'barcode', label: 'Barcode' },
    {
      key: 'price',
      label: 'Price',
      render: (value: string) => `$${value}`,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value: number, row: any) => (
        <Badge variant={value < row.lowStockThreshold ? 'destructive' : 'default'}>
          {value} units
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory</p>
        </div>
        <Button data-testid="button-add-product">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        onEdit={(row) => toast({ title: 'Edit Product', description: `Editing ${row.name}` })}
        onDelete={(row) => toast({ title: 'Delete Product', description: `Would delete ${row.name}`, variant: 'destructive' })}
      />
    </div>
  );
}
