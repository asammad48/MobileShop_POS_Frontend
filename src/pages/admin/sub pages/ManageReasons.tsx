import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTitle } from "@/context/TitleContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import FormPopupModal from "@/components/ui/FormPopupModal";

type Reason = {
  id: number;
  name: string;
  type: "stock_adjustment" | "wastage" | "return" | "damage";
  description?: string;
};

export default function ManageReasons() {
  useAuth("admin");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();

  useEffect(() => {
    setTitle(t("admin.sub_pages.manage_reasons.title") || "Manage Reasons");
    return () => setTitle("Business Dashboard");
  }, [t, setTitle]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reason | null>(null);

  // Mock data for reasons
  const [reasons, setReasons] = useState<Reason[]>([
    { id: 1, name: "Product Expired", type: "wastage", description: "Product passed expiry date" },
    { id: 2, name: "Damaged in Transit", type: "damage", description: "Product damaged during shipping" },
    { id: 3, name: "Customer Return", type: "return", description: "Customer returned the product" },
    { id: 4, name: "Inventory Adjustment", type: "stock_adjustment", description: "Stock count correction" },
    { id: 5, name: "Defective Product", type: "wastage", description: "Manufacturing defect" },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "wastage" as "stock_adjustment" | "wastage" | "return" | "damage",
    description: "",
  });

  const filtered = useMemo(() => {
    if (!search) return reasons;
    return reasons.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
  }, [reasons, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const openAdd = () => {
    setEditing(null);
    setFormData({ name: "", type: "wastage", description: "" });
    setIsModalOpen(true);
  };

  const openEdit = (reason: Reason) => {
    setEditing(reason);
    setFormData({
      name: reason.name,
      type: reason.type,
      description: reason.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (reason: Reason) => {
    if (!confirm(`Delete reason "${reason.name}"?`)) return;
    setReasons(reasons.filter((r) => r.id !== reason.id));
    toast({ title: "Reason deleted successfully" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Please enter a reason name", variant: "destructive" });
      return;
    }

    if (editing) {
      setReasons(
        reasons.map((r) =>
          r.id === editing.id
            ? { ...r, name: formData.name, type: formData.type, description: formData.description }
            : r
        )
      );
      toast({ title: "Reason updated successfully" });
    } else {
      const newReason: Reason = {
        id: Math.max(...reasons.map((r) => r.id), 0) + 1,
        name: formData.name,
        type: formData.type,
        description: formData.description,
      };
      setReasons([...reasons, newReason]);
      toast({ title: "Reason added successfully" });
    }

    setIsModalOpen(false);
    setFormData({ name: "", type: "wastage", description: "" });
    setEditing(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        filterType: "none",
        render: (_: any, __: any, idx: number) => (page - 1) * limit + idx + 1,
      },
      { key: "name", label: t("admin.sub_pages.manage_reasons.name") || "Reason Name", filterType: "text" },
      {
        key: "type",
        label: t("admin.sub_pages.manage_reasons.type") || "Type",
        filterType: "text",
        render: (value: string) => (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {value.replace("_", " ").toUpperCase()}
          </span>
        ),
      },
      {
        key: "description",
        label: t("admin.sub_pages.manage_reasons.description") || "Description",
        filterType: "text",
        render: (value: string) => value || "-",
      },
    ],
    [page, limit, t]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder={t("search") || "Search reasons..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
            data-testid="input-search-reasons"
          />
        </div>

        <div className="flex items-center gap-3">
          <TablePageSizeSelector
            limit={limit}
            onChange={(val) => {
              setLimit(val);
              setPage(1);
            }}
          />
          <Button onClick={openAdd} data-testid="button-add-reason">
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.sub_pages.manage_reasons.add_button") || "Add Reason"}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        showActions
        renderActions={(row: Reason) => (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={() => openEdit(row)} data-testid={`button-edit-${row.id}`}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(row)} data-testid={`button-delete-${row.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        onFilterChange={() => {}}
      />

      <TablePagination page={page} limit={limit} total={filtered.length} onPageChange={setPage} />

      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {editing ? t("admin.sub_pages.manage_reasons.edit_title") || "Edit Reason" : t("admin.sub_pages.manage_reasons.add_title") || "Add New Reason"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("admin.sub_pages.manage_reasons.name") || "Reason Name"}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter reason name"
              data-testid="input-reason-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("admin.sub_pages.manage_reasons.type") || "Type"}
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as typeof formData.type })
              }
              className="w-full p-2 border rounded-md"
              data-testid="select-reason-type"
            >
              <option value="wastage">Wastage</option>
              <option value="damage">Damage</option>
              <option value="return">Return</option>
              <option value="stock_adjustment">Stock Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("admin.sub_pages.manage_reasons.description") || "Description (Optional)"}
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              data-testid="input-reason-description"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} data-testid="button-cancel">
              {t("cancel") || "Cancel"}
            </Button>
            <Button type="submit" data-testid="button-submit-reason">
              {editing ? t("update") || "Update" : t("create") || "Create"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
