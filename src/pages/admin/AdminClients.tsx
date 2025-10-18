import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminClients() {
  useAuth("admin");
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [clients, setClients] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      phone: `03${Math.floor(100000000 + i)}`,
      idNumber: `CNIC-${1000 + i}`,
      address: `Street ${i + 1}`,
      status: "Active",
      joiningDate: "2025-10-18",
      unpaidBalance: i % 3 === 0 ? 200 : 0,
    }))
  );

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return clients.slice(start, start + limit);
  }, [clients, page, limit]);

  const totalPages = Math.ceil(clients.length / limit);

  // 🔹 Modal control + form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    status: "Active",
    joiningDate: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        idNumber: "",
        status: "Active",
        joiningDate: new Date().toISOString().slice(0, 10),
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingClient) {
      // Edit existing
      console.log("Editing client:", formData);
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      toast({ title: "Client Updated", description: `${formData.name} has been updated.` });
    } else {
      // Add new
      console.log("Adding new client:", formData);
      setClients((prev) => [...prev, { id: prev.length + 1, ...formData }]);
      toast({ title: "Client Added", description: `${formData.name} has been added.` });
    }

    setIsModalOpen(false);
  };

  const columns = [
    { key: "index", label: "#", render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1 },
    { key: "name", label: "Name" },
    { key: "idNumber", label: "ID Number" },
    { key: "phone", label: "Phone" },
    {
      key: "unpaidBalance",
      label: "Unpaid Balance",
      render: (value: number) =>
        value > 0 ? <Badge variant="destructive">PKR {value}</Badge> : <Badge variant="default">PKR 0</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your clients</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Show 10" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="25">Show 25</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Client</Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        onEdit={(row) => handleOpenModal(row)} // 👈 Edit triggers modal
        showActions={true}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, clients.length)} of {clients.length}
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

      {/* Modal */}
      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">{editingClient ? "Edit Client" : "Add New Client"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "address", "idNumber"].map((field) => (
            <div key={field}>
              <Label className="capitalize">{field}</Label>
              <Input name={field} value={(formData as any)[field]} onChange={handleChange} required />
            </div>
          ))}
          <div>
            <Label>Status</Label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingClient ? "Update" : "Add"} Client</Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
