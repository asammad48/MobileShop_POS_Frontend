import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Providers() {
  useAuth('admin');
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [providers, setProviders] = useState([
    { id: 1, name: "UNKNOWN", document: "VDSFRT43", balance: -1139.0 },
    { id: 2, name: "EU MOVIL", document: "CF5509876", balance: 130.0 },
    { id: 3, name: "TALK 2 TALK", document: "B10653806", balance: 0.0 },
  ]);

  const paginatedProviders = useMemo(() => {
    const start = (page - 1) * limit;
    return providers.slice(start, start + limit);
  }, [providers, page, limit]);

  const totalPages = Math.ceil(providers.length / limit);

  const columns = [
    { key: 'index', label: '#', render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1 },
    { key: 'name', label: 'Provider Name' },
    { key: 'document', label: 'CIF/DNI/PASSPORT' },
    {
      key: 'balance',
      label: 'Balance',
      render: (value: number) =>
        value < 0 ? (
          <Badge variant="destructive">{value.toFixed(2)}</Badge>
        ) : (
          <Badge variant="default">+{value.toFixed(2)}</Badge>
        ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProvider, setEditProvider] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newProvider = {
      id: providers.length + 1,
      name: formData.get("name") as string,
      document: formData.get("document") as string,
      balance: parseFloat(formData.get("balance") as string) || 0,
    };
    console.log("Provider submitted:", newProvider);
    setProviders([...providers, newProvider]);
    setIsModalOpen(false);
    toast({ title: "Provider Added", description: `${newProvider.name} has been added.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Providers</h1>
          <p className="text-muted-foreground mt-1">Manage your providers</p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
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

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create New Provider
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedProviders}
        onEdit={(row) => {
          setEditProvider(row);
          setIsModalOpen(true);
        }}
        showActions={true}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, providers.length)} of {providers.length}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <FormPopupModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditProvider(null); }}>
        <h2 className="text-2xl font-semibold mb-4">
          {editProvider ? "Edit Provider" : "Add New Provider"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Provider Name</Label>
            <Input name="name" defaultValue={editProvider?.name || ""} placeholder="Enter provider name" required />
          </div>

          <div>
            <Label>CIF / DNI / Passport</Label>
            <Input name="document" defaultValue={editProvider?.document || ""} placeholder="Enter document number" />
          </div>

          <div>
            <Label>Opening Balance</Label>
            <Input name="balance" type="number" step="0.01" defaultValue={editProvider?.balance || 0} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editProvider ? "Update Provider" : "Add Provider"}</Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
