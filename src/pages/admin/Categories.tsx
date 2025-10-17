import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockCategories } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Categories() {
  useAuth('admin');
  const [categories] = useState(mockCategories); //todo: remove mock functionality
  const { toast } = useToast();

  const columns = [
    { key: 'name', label: 'Category Name' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products</p>
        </div>
        <Button data-testid="button-add-category">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        onEdit={(row) => toast({ title: 'Edit Category', description: `Editing ${row.name}` })}
        onDelete={(row) => toast({ title: 'Delete Category', description: `Would delete ${row.name}`, variant: 'destructive' })}
      />
    </div>
  );
}
