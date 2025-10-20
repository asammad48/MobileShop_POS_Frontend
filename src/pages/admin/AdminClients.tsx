// ✅ pages/admin/AdminClients.tsx (Fixed with working Add/Edit modal)
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Printer, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { printElement } from "@/utils/print";
import { useTranslation } from "react-i18next";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";

export default function AdminClients() {
  useAuth("admin");
  const { toast } = useToast();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewingClient, setViewingClient] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    paymentMethod: "Cash",
  });

  const [clients, setClients] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      phone: `03${Math.floor(100000000 + i)}`,
      idNumber: `1234567${i}A`,
      address: `Street ${i + 1}, Barcelona`,
      status: "Active",
      joiningDate: "2025-10-18",
      unpaidBalance: i % 3 === 0 ? 200 : 0,
      paymentMethod: i % 2 === 0 ? "Credit Card" : "Cash",
      lastPurchase: "2025-09-25",
    }))
  );

  // 🔍 Filtering
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesName =
        !filters.name ||
        c.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesId =
        !filters.idNumber ||
        c.idNumber.toLowerCase().includes(filters.idNumber.toLowerCase());
      const matchesBalance =
        !filters.unpaidBalance ||
        (filters.unpaidBalance === "Paid" && c.unpaidBalance === 0) ||
        (filters.unpaidBalance === "Unpaid" && c.unpaidBalance > 0);
      return matchesName && matchesId && matchesBalance;
    });
  }, [clients, filters]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredClients.slice(start, start + limit);
  }, [filteredClients, page, limit]);

  // 🔧 Open Add/Edit Modal
  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        idNumber: client.idNumber,
        address: client.address,
        paymentMethod: client.paymentMethod,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        idNumber: "",
        address: "",
        paymentMethod: "Cash",
      });
    }
    setIsModalOpen(true);
  };

  // 🧾 Print single client info
  const handlePrintRow = async (row: any) => {
    const container = document.createElement("div");
    container.id = "client-print-container";
    container.innerHTML = `
      <div style="padding:40px;">
        <h2>Client Information</h2>
        <table><tbody>
          ${Object.entries({
            Name: row.name,
            "ID Number": row.idNumber,
            Email: row.email,
            Phone: row.phone,
            Address: row.address,
            "Payment Method": row.paymentMethod,
            "Last Purchase": row.lastPurchase,
            "Joining Date": row.joiningDate,
            Status: row.status,
            "Unpaid Balance (€)": row.unpaidBalance,
          })
            .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
            .join("")}
        </tbody></table>
      </div>`;
    document.body.appendChild(container);
    await printElement("client-print-container", {
      title: `Client - ${row.name}`,
      onAfterPrint: () => document.body.removeChild(container),
    });
  };

  // 🧠 Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Save client (Add or Edit)
  const handleSubmitClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id ? { ...c, ...formData } : c
        )
      );
      toast({ title: "Client Updated", description: `${formData.name} has been updated.` });
    } else {
      const newClient = {
        id: clients.length + 1,
        ...formData,
        unpaidBalance: 0,
        status: "Active",
        joiningDate: new Date().toISOString().split("T")[0],
        lastPurchase: "-",
      };
      setClients([...clients, newClient]);
      toast({ title: "Client Added", description: `${formData.name} has been added.` });
    }

    setIsModalOpen(false);
  };

  // Table columns
  const columns = [
    {
      key: "index",
      label: "#",
      filterType: "none",
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    { key: "name", label: t("admin.clients.name"), filterType: "text" },
    { key: "idNumber", label: t("admin.clients.id_number"), filterType: "text" },
    { key: "phone", label: t("admin.clients.phone"), filterType: "text" },
    {
      key: "unpaidBalance",
      label: t("admin.clients.unpaid_balance"),
      filterType: "select",
      filterOptions: ["Paid", "Unpaid"],
      render: (value: number) =>
        value > 0 ? (
          <Badge variant="destructive">€{value}</Badge>
        ) : (
          <Badge variant="default">€0</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            {t("admin.clients.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.clients.sub_title")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TablePageSizeSelector
            limit={limit}
            onChange={(val) => {
              setLimit(val);
              setPage(1);
            }}
          />
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.clients.add_client")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        showActions
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl hover:bg-blue-100 hover:text-blue-600"
              onClick={() => setViewingClient(row)}
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl hover:bg-amber-100 hover:text-amber-600"
              onClick={() => handlePrintRow(row)}
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
              onClick={() => handleOpenModal(row)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
        onFilterChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        limit={limit}
        total={filteredClients.length}
        onPageChange={setPage}
      />

      {/* ✅ Add/Edit Modal */}
      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">
          {editingClient ? "Edit Client" : "Add New Client"}
        </h2>
        <form onSubmit={handleSubmitClient} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <Label>ID Number</Label>
            <Input
              name="idNumber"
              value={formData.idNumber}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <Label>Payment Method</Label>
            <Input
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingClient ? "Update Client" : "Add Client"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
