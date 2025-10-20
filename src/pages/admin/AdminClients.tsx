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
import { useTranslation } from 'react-i18next';
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";

export default function AdminClients() {
  useAuth("admin");
  const { toast } = useToast();
  const {t} = useTranslation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewingClient, setViewingClient] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);

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

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return clients.slice(start, start + limit);
  }, [clients, page, limit]);

  const totalPages = Math.ceil(clients.length / limit);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    status: "Active",
    joiningDate: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    if (!dniRegex.test(formData.idNumber) && !nieRegex.test(formData.idNumber)) {
      toast({
        title: "Invalid ID Format",
        description:
          "Please enter a valid Spanish DNI (12345678A) or NIE (X1234567B).",
        variant: "destructive",
      });
      return;
    }

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      toast({
        title: "Client Updated",
        description: `${formData.name} has been updated.`,
      });
    } else {
      setClients((prev) => [...prev, { id: prev.length + 1, ...formData }]);
      toast({
        title: "Client Added",
        description: `${formData.name} has been added.`,
      });
    }

    setIsModalOpen(false);
  };

  const handlePrintRow = async (row: any) => {
    // Create a temporary hidden container for print
    const container = document.createElement("div");
    container.id = "client-print-container";
    container.innerHTML = `
      <div style="padding:40px;">
        <h2>Client Information</h2>
        <table>
          <tbody>
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
        .map(
          ([key, value]) =>
            `<tr><th>${key}</th><td>${value}</td></tr>`
        )
        .join("")}
          </tbody>
        </table>
      </div>
    `;
    document.body.appendChild(container);

    // Use the shared print utility
    await printElement("client-print-container", {
      title: `Client - ${row.name}`,
      onAfterPrint: () => document.body.removeChild(container),
    });
  };


  const handleView = (row: any) => {
    setViewingClient(row);
  };

  const columns = [
    {
      key: "index",
      label: "#",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    { key: "name", label: t("admin.clients.name") },
    { key: "idNumber", label: t("admin.clients.id_number") },
    { key: "phone", label: t("admin.clients.phone") },
    {
      key: "unpaidBalance",
      label: t("admin.clients.unpaid_balance"),
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
          <h1 className="text-3xl font-semibold">{t("admin.clients.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("admin.clients.sub_title")}</p>
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
            <Plus className="w-4 h-4 mr-2" />{t("admin.clients.add_client")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        showActions={true}
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl hover:bg-blue-100 hover:text-blue-600"
              onClick={() => handleView(row)}
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
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        limit={limit}
        total={clients.length}
        onPageChange={setPage}
      />

      {/* View Client Modal */}
      {viewingClient && (
        <div id="printable-document" className="fixed inset-0 !m-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[700px] relative shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Detailed profile and account summary
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-sm text-gray-800">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-gray-500 font-medium">Name</p>
                  <p className="font-semibold">{viewingClient.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">ID</p>
                  <p>{viewingClient.idNumber}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Email</p>
                  <p>{viewingClient.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Phone</p>
                  <p>{viewingClient.phone}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">Address</p>
                  <p>{viewingClient.address}</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-gray-500 font-medium">Payment Method</p>
                  <p>{viewingClient.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Last Purchase</p>
                  <p>{viewingClient.lastPurchase}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Joining Date</p>
                  <p>{viewingClient.joiningDate}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${viewingClient.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {viewingClient.status}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">Unpaid Balance</p>
                  <p
                    className={`text-lg font-bold ${viewingClient.unpaidBalance > 0
                        ? "text-red-600"
                        : "text-green-700"
                      }`}
                  >
                    €{viewingClient.unpaidBalance}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-end gap-3 no-print">
              <Button
                variant="outline"
                className="hover:bg-gray-100"
                onClick={() => setViewingClient(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => handlePrintRow(viewingClient)}
                className="bg-primary hover:shadow-md transition-shadow"
              >
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* Add/Edit Modal */}
      <FormPopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editingClient ? "Edit Client" : "Add New Client"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "address", "idNumber"].map((field) => (
            <div key={field}>
              <Label className="capitalize">{field}</Label>
              <Input
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingClient ? "Update" : "Add"} Client
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
