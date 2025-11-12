import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/context/TitleContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/DataTable";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Plus, Edit, Trash2, Package, DollarSign, TrendingUp, Tag } from "lucide-react";
import StatCard from "@/components/StatCard";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  discount?: number;
  isActive: boolean;
};

export default function WholesalerDashboard() {
  useAuth("wholesaler");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setTitle(t("wholesaler.dashboard.title") || "Wholesale Products Dashboard");
    return () => setTitle("Dashboard");
  }, [t, setTitle]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "iPhone 15 Pro Cases (Bulk)", description: "Premium silicone cases, pack of 50", category: "Accessories", price: 250, stock: 500, discount: 10, isActive: true },
    { id: 2, name: "Samsung Chargers (Bulk)", description: "Fast charging adapters, pack of 100", category: "Chargers", price: 400, stock: 1000, isActive: true },
    { id: 3, name: "USB-C Cables (Bulk)", description: "High quality cables, pack of 200", category: "Cables", price: 600, stock: 2000, discount: 15, isActive: true },
    { id: 4, name: "Screen Protectors (Bulk)", description: "Tempered glass, pack of 500", category: "Accessories", price: 1200, stock: 5000, isActive: true },
    { id: 5, name: "Power Banks (Bulk)", description: "10000mAh power banks, pack of 50", category: "Accessories", price: 750, stock: 300, discount: 20, isActive: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    discount: "",
    isActive: true,
  });

  const stats = useMemo(() => {
    const activeProducts = products.filter(p => p.isActive);
    const totalStock = activeProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = activeProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const avgDiscount = activeProducts.filter(p => p.discount).reduce((sum, p) => sum + (p.discount || 0), 0) / (activeProducts.filter(p => p.discount).length || 1);
    return {
      totalProducts: activeProducts.length,
      totalStock,
      totalValue: totalValue.toFixed(2),
      avgDiscount: avgDiscount.toFixed(1),
    };
  }, [products]);

  const openAdd = () => {
    setEditing(null);
    setFormData({ name: "", description: "", category: "", price: "", stock: "", discount: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: product.discount?.toString() || "",
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    setProducts(products.filter((p) => p.id !== product.id));
    toast({ title: "Product deleted successfully" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.stock) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editing) {
      setProducts(
        products.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
              }
            : p
        )
      );
      toast({ title: "Product updated successfully" });
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        isActive: formData.isActive,
      };
      setProducts([...products, newProduct]);
      toast({ title: "Product added successfully" });
    }

    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      { key: "name", label: "Product Name", filterType: "text" },
      { key: "category", label: "Category", filterType: "text" },
      {
        key: "price",
        label: "Price",
        filterType: "none",
        render: (value: number) => `$${value.toFixed(2)}`,
      },
      {
        key: "stock",
        label: "Stock",
        filterType: "none",
      },
      {
        key: "discount",
        label: "Discount",
        filterType: "none",
        render: (value: number | undefined) => value ? `${value}%` : "-",
      },
      {
        key: "isActive",
        label: "Status",
        filterType: "none",
        render: (value: boolean) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user?.businessName || user?.username}!</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your wholesale products and inventory</p>
        </div>
        <Button onClick={openAdd} data-testid="button-add-product" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Products"
          value={stats.totalProducts.toString()}
          icon={Package}
          gradient="from-blue-500/10 to-indigo-500/10"
        />
        <StatCard
          title="Total Stock"
          value={stats.totalStock.toString()}
          icon={TrendingUp}
          gradient="from-green-500/10 to-teal-500/10"
        />
        <StatCard
          title="Inventory Value"
          value={`$${stats.totalValue}`}
          icon={DollarSign}
          gradient="from-purple-500/10 to-pink-500/10"
        />
        <StatCard
          title="Avg Discount"
          value={`${stats.avgDiscount}%`}
          icon={Tag}
          gradient="from-amber-500/10 to-orange-500/10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Products & Offers</CardTitle>
          <CardDescription>Manage your wholesale products, deals, and special offers</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products}
            showActions
            renderActions={(row: Product) => (
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
        </CardContent>
      </Card>

      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">{editing ? "Edit Product" : "Add New Product"}</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., iPhone Cases (Bulk)"
              data-testid="input-product-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the product"
              data-testid="input-product-description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Accessories"
              data-testid="input-product-category"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                data-testid="input-product-price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock *</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                data-testid="input-product-stock"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Discount (%)</label>
            <Input
              type="number"
              step="0.1"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="0"
              data-testid="input-product-discount"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4"
              data-testid="checkbox-product-active"
            />
            <label className="text-sm">Product is active and available</label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-product">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
