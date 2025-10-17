import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

export default function AdminClients() {
  useAuth('admin');
  const { toast } = useToast();


  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // 🔹 Mock client data
  const [clients] = useState(
    Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      idNumber: `CNIC-${1000 + i}`,
      phone: `03${Math.floor(100000000 + i)}`,
      unpaidBalance: i % 3 === 0 ? 200 : 0,
    }))
  );

  // 🔹 Derived data for current page
  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return clients.slice(start, start + limit);
  }, [clients, page, limit]);

  const totalPages = Math.ceil(clients.length / limit);

  // 🔹 Table columns
  const columns = [
    {
      key: 'index',
      label: '#',
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    { key: 'name', label: 'Name' },
    { key: 'idNumber', label: 'ID Number' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'unpaidBalance',
      label: 'Unpaid Balance',
      render: (value: number) =>
        value > 0 ? (
          <Badge variant="destructive">${value}</Badge>
        ) : (
          <Badge variant="default">$0</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your clients</p>
        </div>

        <div className="flex items-center gap-3">
          {/* 🔹 Dropdown for results per page */}
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1); // reset to first page
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Show 10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="25">Show 25</SelectItem>
              <SelectItem value="50">Show 50</SelectItem>
              <SelectItem value="100">Show 100</SelectItem>
            </SelectContent>
          </Select>

          {/* 🔹 Add New Client button */}
          <Link to="/admin/clients/addclient">
            <Button data-testid="button-add-client">
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
            </Button>
          </Link>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        onEdit={(row) =>
          toast({ title: 'Edit Client', description: `Editing ${row.name}` })
        }
        onDelete={(row) =>
          toast({
            title: 'Delete Client',
            description: `Would delete ${row.name}`,
            variant: 'destructive',
          })
        }
      />

      {/* 🔹 Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}–
          {Math.min(page * limit, clients.length)} of {clients.length}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
