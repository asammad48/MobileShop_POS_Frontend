import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockStaff } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ManageStaff() {
  useAuth('admin');
  const [staff] = useState(mockStaff); //todo: remove mock functionality
  const { toast } = useToast();

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Manage Staff</h1>
          <p className="text-muted-foreground mt-1">Add and manage sales persons</p>
        </div>
        <Button data-testid="button-add-staff">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={staff}
        onEdit={(row) => toast({ title: 'Edit Staff', description: `Editing ${row.username}` })}
        onDelete={(row) => toast({ title: 'Delete Staff', description: `Would delete ${row.username}`, variant: 'destructive' })}
      />
    </div>
  );
}
