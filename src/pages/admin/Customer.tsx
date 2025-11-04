import { useState, useMemo, useEffect } from "react";
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
import { useTitle } from "@/context/TitleContext";
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ReactSelect from "react-select";
import countryList from "react-select-country-list";

export default function Customer() {
  useAuth(["admin", "sales_person"]);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const options = countryList().getData();

  useEffect(() => {
    setTitle(t("admin.clients.title"));
    return () => setTitle("Business Dashboard");
  }, [setTitle]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewingClient, setViewingClient] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    documentType: "",
    documentNumber: "",
    dob: "",
    nationality: "",
    address: "",
    postelCode: "",
    city: "",
    province: "",
    phone: "",
    email: "",
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

  // Filtering
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

  // Open Add/Edit Modal
  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        documentType: client.documentType || "",
        documentNumber: client.documentNumber || "",
        dob: client.dob || "",
        nationality: client.nationality || "",
        address: client.address,
        postelCode: client.postelCode || "",
        city: client.city || "",
        province: client.province || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        documentType: "",
        documentNumber: "",
        dob: "",
        nationality: "",
        address: "",
        postelCode: "",
        city: "",
        province: "",
        phone: "",
        email: "",
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

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({ title: "Please fill all required fields", variant: "destructive" });
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
      const newClient = {
        id: clients.length + 1,
        ...formData,
        unpaidBalance: 0,
        status: "Active",
        joiningDate: new Date().toISOString().split("T")[0],
        lastPurchase: "-",
      };
      setClients([...clients, newClient]);
      toast({
        title: "Client Added",
        description: `${formData.name} has been added.`,
      });
    }

    setIsModalOpen(false);
    setErrors({});
  };

  // Table columns
  const columns = [
    {
      key: "index",
      label: "#",
      filterType: "none",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
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
      <div className="flex items-center justify-end">
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
          {/* Name field */}
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                handleFormChange(e);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Document Type Dropdown */}
          <div>
            <Label>Document Type</Label>
            <ShadSelect
              value={formData.documentType}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, documentType: value }));
                setErrors((prev) => ({ ...prev, documentType: "" }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nid">National ID</SelectItem>
                <SelectItem value="nie">Foreigner ID (NIE)</SelectItem>
                <SelectItem value="dni">Citizen ID (DNI)</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </ShadSelect>
            {errors.documentType && (
              <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>
            )}
          </div>

          {/* Rest of the fields */}
          {[
            { label: "Document Number", name: "documentNumber", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={(e) => {
                  handleFormChange(e);
                  setErrors((prev) => ({ ...prev, [field.name]: "" }));
                }}
                required
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* 🌍 Nationality Dropdown */}
          <div>
            <Label>Nationality</Label>
            <ReactSelect
              options={options}
              value={options.find((c) => c.label === formData.nationality) || null}
              onChange={(selected: any) => {
                setFormData((prev) => ({ ...prev, nationality: selected.label }));
                setErrors((prev) => ({ ...prev, nationality: "" }));
              }}
              placeholder="Select country"
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
            )}
          </div>

          {/* Address and other info */}
          {[
            { label: "Address", name: "address", type: "text" },
            { label: "Postal Code", name: "postelCode", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Province", name: "province", type: "text" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Email", name: "email", type: "email" },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={(e) => {
                  handleFormChange(e);
                  setErrors((prev) => ({ ...prev, [field.name]: "" }));
                }}
                required
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Submit buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
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
