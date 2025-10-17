import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockAdmins } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ManageAdmins() {
  useAuth('super_admin');
  const [admins] = useState(mockAdmins); //todo: remove mock functionality
  const { toast } = useToast();

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'shopName', label: 'Shop Name' },
    {
      key: 'subscriptionTier',
      label: 'Plan',
      render: (value: string) => (
        <Badge variant={value === 'platinum' ? 'default' : 'secondary'}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (admin: any) => {
    toast({ title: 'Edit Admin', description: `Editing ${admin.username}` });
  };

  const handleDelete = (admin: any) => {
    toast({ 
      title: 'Delete Admin', 
      description: `Would delete ${admin.username}`,
      variant: 'destructive'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Manage Admins</h1>
          <p className="text-muted-foreground mt-1">View and manage shop owners</p>
        </div>
        <Button data-testid="button-add-admin">
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
