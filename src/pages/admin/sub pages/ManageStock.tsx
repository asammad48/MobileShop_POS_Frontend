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
import { Plus, Minus, Trash2 } from "lucide-react";
import FormPopupModal from "@/components/ui/FormPopupModal";

type Product = {
  id: number;
  name: string;
  barcode: string;
  category: string;
  currentStock: number;
  price: number;
};

type StockAction = "add" | "remove" | "wastage";

export default function ManageStock() {
  useAuth("admin");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();

  useEffect(() => {
    setTitle(t("admin.sub_pages.manage_stock.title") || "Manage Stock");
    return () => setTitle("Business Dashboard");
  }, [t, setTitle]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<StockAction>("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "iPhone 15 Pro", barcode: "IP15P001", category: "Mobile", currentStock: 25, price: 999 },
    { id: 2, name: "Samsung Galaxy S24", barcode: "SGS24001", category: "Mobile", currentStock: 15, price: 899 },
    { id: 3, name: "Phone Case - Clear", barcode: "PC001", category: "Accessories", currentStock: 50, price: 19.99 },
    { id: 4, name: "Screen Protector", barcode: "SP001", category: "Accessories", currentStock: 100, price: 9.99 },
    { id: 5, name: "USB-C Cable", barcode: "USBC001", category: "Accessories", currentStock: 75, price: 14.99 },
    { id: 6, name: "Google Pixel 8", barcode: "GP8001", category: "Mobile", currentStock: 8, price: 699 },
    { id: 7, name: "OnePlus 12", barcode: "OP12001", category: "Mobile", currentStock: 12, price: 799 },
    { id: 8, name: "Wireless Charger", barcode: "WC001", category: "Accessories", currentStock: 30, price: 29.99 },
  ]);

  // Mock reasons from ManageReasons
  const reasons = [
    { id: 1, name: "Product Expired", type: "wastage" },
    { id: 2, name: "Damaged in Transit", type: "damage" },
    { id: 3, name: "Customer Return", type: "return" },
    { id: 4, name: "Inventory Adjustment", type: "stock_adjustment" },
    { id: 5, name: "Defective Product", type: "wastage" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const openModal = (product: Product, action: StockAction) => {
    setSelectedProduct(product);
    setActionType(action);
    setFormData({ quantity: "", reason: "", notes: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast({ title: "Please enter a valid quantity", variant: "destructive" });
      return;
    }

    if (actionType === "wastage" && !formData.reason) {
      toast({ title: "Please select a reason for wastage", variant: "destructive" });
      return;
    }

    if (!selectedProduct) return;

    const quantity = parseInt(formData.quantity);

    if ((actionType === "remove" || actionType === "wastage") && quantity > selectedProduct.currentStock) {
      toast({
        title: "Insufficient stock",
        description: `Cannot ${actionType === "wastage" ? "move to wastage" : "remove"} ${quantity} items. Only ${selectedProduct.currentStock} available.`,
        variant: "destructive",
      });
      return;
    }

    setProducts(
      products.map((p) => {
        if (p.id !== selectedProduct.id) return p;

        let newStock = p.currentStock;
        if (actionType === "add") {
          newStock += quantity;
        } else {
          newStock -= quantity;
        }

        return { ...p, currentStock: newStock };
      })
    );

    const actionText = actionType === "add" ? "added to" : actionType === "remove" ? "removed from" : "moved to wastage from";
    toast({
      title: "Stock updated successfully",
      description: `${quantity} unit(s) ${actionText} ${selectedProduct.name}`,
    });

    setIsModalOpen(false);
    setFormData({ quantity: "", reason: "", notes: "" });
    setSelectedProduct(null);
  };

  const columns = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        filterType: "none",
        render: (_: any, __: any, idx: number) => (page - 1) * limit + idx + 1,
      },
      { key: "barcode", label: t("admin.sub_pages.manage_stock.barcode") || "Barcode", filterType: "text" },
      { key: "name", label: t("admin.sub_pages.manage_stock.product_name") || "Product Name", filterType: "text" },
      { key: "category", label: t("admin.sub_pages.manage_stock.category") || "Category", filterType: "text" },
      {
        key: "currentStock",
        label: t("admin.sub_pages.manage_stock.current_stock") || "Current Stock",
        filterType: "none",
        render: (value: number) => (
          <span className={`font-semibold ${value < 10 ? "text-red-500" : value < 20 ? "text-amber-500" : "text-green-500"}`}>
            {value}
          </span>
        ),
      },
      {
        key: "price",
        label: t("admin.sub_pages.manage_stock.price") || "Price",
        filterType: "none",
        render: (value: number) => `$${value.toFixed(2)}`,
      },
    ],
    [page, limit, t]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder={t("search") || "Search by name or barcode..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
            data-testid="input-search-products"
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
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        showActions
        renderActions={(row: Product) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 hover:text-green-700"
              onClick={() => openModal(row, "add")}
              data-testid={`button-add-stock-${row.id}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => openModal(row, "remove")}
              data-testid={`button-remove-stock-${row.id}`}
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => openModal(row, "wastage")}
              data-testid={`button-wastage-${row.id}`}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Wastage
            </Button>
          </div>
        )}
        onFilterChange={() => {}}
      />

      <TablePagination page={page} limit={limit} total={filtered.length} onPageChange={setPage} />

      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {actionType === "add"
              ? t("admin.sub_pages.manage_stock.add_stock") || "Add Stock"
              : actionType === "remove"
              ? t("admin.sub_pages.manage_stock.remove_stock") || "Remove Stock"
              : t("admin.sub_pages.manage_stock.move_to_wastage") || "Move to Wastage"}
          </h2>

          {selectedProduct && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Product</p>
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Current Stock: <span className="font-semibold">{selectedProduct.currentStock}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("admin.sub_pages.manage_stock.quantity") || "Quantity"}
            </label>
            <Input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              data-testid="input-quantity"
            />
          </div>

          {actionType === "wastage" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("admin.sub_pages.manage_stock.reason") || "Reason"}
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 border rounded-md"
                data-testid="select-wastage-reason"
              >
                <option value="">Select a reason</option>
                {reasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("admin.sub_pages.manage_stock.notes") || "Notes (Optional)"}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes..."
              className="w-full p-2 border rounded-md min-h-[80px]"
              data-testid="textarea-notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} data-testid="button-cancel">
              {t("cancel") || "Cancel"}
            </Button>
            <Button type="submit" data-testid="button-submit-stock">
              {actionType === "add" ? t("add") || "Add" : actionType === "remove" ? t("remove") || "Remove" : t("confirm") || "Confirm"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
