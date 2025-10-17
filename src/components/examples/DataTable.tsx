import DataTable from '../DataTable';
import { Badge } from '@/components/ui/badge';

export default function DataTableExample() {
  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'barcode', label: 'Barcode' },
    { 
      key: 'price', 
      label: 'Price',
      render: (value: string) => `$${value}`
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value: number) => (
        <Badge variant={value < 5 ? 'destructive' : 'default'}>
          {value} units
        </Badge>
      )
    },
  ];

  const data = [
    { id: '1', name: 'iPhone 13 Screen', barcode: '123456789', price: '89.99', stock: 12 },
    { id: '2', name: 'Samsung S21 Battery', barcode: '987654321', price: '45.50', stock: 3 },
    { id: '3', name: 'Phone Case Premium', barcode: '111222333', price: '15.99', stock: 25 },
  ];

  return (
    <div className="p-6">
      <DataTable 
        columns={columns} 
        data={data}
        onEdit={(row) => console.log('Edit:', row)}
        onDelete={(row) => console.log('Delete:', row)}
      />
    </div>
  );
}
