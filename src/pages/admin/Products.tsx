import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Products() {
  useAuth("admin");
  const { toast } = useToast();

  // Example data
  const [products, setProducts] = useState([
    { id: 1, name: "iPhone 12", imeiOrSerial: "SN12345", stock: 5, salePrice: 900 },
    { id: 2, name: "Samsung Galaxy", imeiOrSerial: "SN12346", stock: 3, salePrice: 800 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isInterStockModalOpen, setIsInterStockModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    salePrice: 0,
  });

  // Columns
  const columns = [
    { key: "id", label: "#" },
    { key: "name", label: "Product Name" },
    { key: "imeiOrSerial", label: "IMEI/Serial" },
    {
      key: "stock",
      label: "Stock",
      render: (value: number) => <Badge variant={value <= 0 ? "destructive" : "default"}>{value}</Badge>,
    },
    { key: "salePrice", label: "Sale Price", render: (value: number) => `$${value}` },
  ];

  // Handle creating/editing products
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, salePrice } = formData;

    if (currentProduct) {
      // Edit
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id ? { ...product, name, salePrice } : product
      );
      setProducts(updatedProducts);
      toast({ title: "Product Updated", description: `${name} has been updated.` });
    } else {
      // Add
      const newProduct = { id: products.length + 1, name, imeiOrSerial: "", stock: 0, salePrice };
      setProducts([...products, newProduct]);
      toast({ title: "Product Added", description: `${name} has been added.` });
    }

    setIsModalOpen(false);
  };

  // Handle modal input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add Product modal
  const openCreateModal = () => {
    setCurrentProduct(null);
    setFormData({ name: "", salePrice: 0 });
    setIsModalOpen(true);
  };

  // Open Edit Product modal
  const openEditModal = (product: any) => {
    setCurrentProduct(product);
    setFormData({ name: product.name, salePrice: product.salePrice });
    setIsModalOpen(true);
  };

  // Open Stock Modal (Add/Return)
  const openManageStockModal = (product: any) => {
    setCurrentProduct(product);
    setIsStockModalOpen(true);
  };

  // Inter-Stock Transfer modal
  const openInterStockModal = () => {
    setIsInterStockModalOpen(true);
  };

  // Manage Stock (Add/Return) logic
  const handleStockSubmit = (e: React.FormEvent<HTMLFormElement>, action: "add" | "return") => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const quantity = parseInt((form.elements.namedItem("quantity") as HTMLInputElement).value);

    if (action === "add") {
      // Add stock
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? { ...product, stock: product.stock + quantity } : product
        )
      );
      toast({ title: "Stock Added", description: `${quantity} items added to ${currentProduct.name}` });
    } else if (action === "return") {
      // Return stock (e.g., mark stock as returned or move it back to inventory)
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? { ...product, stock: product.stock - quantity } : product
        )
      );
      toast({ title: "Stock Returned", description: `${quantity} items returned from ${currentProduct.name}` });
    }

    setIsStockModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Product
          </Button>
          <Button variant="outline" onClick={openInterStockModal}>
            Inter Stock Transfer
          </Button>
          <Button variant="outline" onClick={openManageStockModal}>Manage Stock</Button>
        </div>
      </div>

      <DataTable columns={columns} data={products} onEdit={openEditModal} showActions={true} />

      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold">{currentProduct ? "Edit Product" : "Create New Product"}</h2>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <Label>Product Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label>Sale Price (PKR)</Label>
            <Input name="salePrice" type="number" step="0.01" value={formData.salePrice} onChange={handleChange} required />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{currentProduct ? "Update Product" : "Save Product"}</Button>
          </div>
        </form>
      </FormPopupModal>

      {/* Manage Stock Modal */}
      <FormPopupModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)}>
        <h2 className="text-2xl font-semibold">Manage Stock</h2>
        <form onSubmit={(e) => handleStockSubmit(e, "add")} className="space-y-4">
          <div>
            <Label>Quantity</Label>
            <Input type="number" name="quantity" min="1" required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsStockModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Stock</Button>
          </div>
        </form>
        <form onSubmit={(e) => handleStockSubmit(e, "return")} className="space-y-4">
          <div>
            <Label>Return Quantity</Label>
            <Input type="number" name="quantity" min="1" required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsStockModalOpen(false)}>Cancel</Button>
            <Button type="submit">Return Stock</Button>
          </div>
        </form>
      </FormPopupModal>

      {/* Inter-Stock Movement Modal */}
      <FormPopupModal isOpen={isInterStockModalOpen} onClose={() => setIsInterStockModalOpen(false)}>
        <h2 className="text-2xl font-semibold">Inter-Store Stock Movement</h2>
        {/* This can include a table with search functionality, to move stock between stores */}
        <form className="space-y-4">
          <div>
            <Label>Enter IMEI or Serial Number</Label>
            <Input type="text" placeholder="Enter IMEI or Serial Number" required />
          </div>

          <div>
            <Label>Send Stock To</Label>
            <select className="w-full border px-3 py-2">
              <option value="store1">Store 1</option>
              <option value="store2">Store 2</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsInterStockModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Transfer Stock</Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
