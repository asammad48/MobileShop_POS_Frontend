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
import { Plus, Edit, Trash2, DollarSign, Wrench, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  isActive: boolean;
};

export default function RepairManDashboard() {
  useAuth("repair_man");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setTitle(t("repair_man.dashboard.title") || "Repair Services Dashboard");
    return () => setTitle("Dashboard");
  }, [t, setTitle]);

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Screen Replacement", description: "Replace cracked or damaged screen", price: 120, estimatedTime: 60, isActive: true },
    { id: 2, name: "Battery Replacement", description: "Replace old battery with new one", price: 80, estimatedTime: 30, isActive: true },
    { id: 3, name: "Charging Port Repair", description: "Fix or replace charging port", price: 60, estimatedTime: 45, isActive: true },
    { id: 4, name: "Water Damage Repair", description: "Clean and repair water damaged device", price: 150, estimatedTime: 120, isActive: true },
    { id: 5, name: "Camera Repair", description: "Fix or replace camera module", price: 100, estimatedTime: 60, isActive: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    estimatedTime: "",
    isActive: true,
  });

  const stats = useMemo(() => {
    const totalServices = services.filter(s => s.isActive).length;
    const avgPrice = services.filter(s => s.isActive).reduce((sum, s) => sum + s.price, 0) / (totalServices || 1);
    return {
      totalServices,
      avgPrice: avgPrice.toFixed(2),
      totalRevenue: (services.length * 500).toFixed(2), // Mock
    };
  }, [services]);

  const openAdd = () => {
    setEditing(null);
    setFormData({ name: "", description: "", price: "", estimatedTime: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      estimatedTime: service.estimatedTime.toString(),
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (service: Service) => {
    if (!confirm(`Delete service "${service.name}"?`)) return;
    setServices(services.filter((s) => s.id !== service.id));
    toast({ title: "Service deleted successfully" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.estimatedTime) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editing) {
      setServices(
        services.map((s) =>
          s.id === editing.id
            ? { ...s, ...formData, price: parseFloat(formData.price), estimatedTime: parseInt(formData.estimatedTime) }
            : s
        )
      );
      toast({ title: "Service updated successfully" });
    } else {
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        estimatedTime: parseInt(formData.estimatedTime),
        isActive: formData.isActive,
      };
      setServices([...services, newService]);
      toast({ title: "Service added successfully" });
    }

    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      { key: "name", label: "Service Name", filterType: "text" },
      { key: "description", label: "Description", filterType: "text" },
      {
        key: "price",
        label: "Price",
        filterType: "none",
        render: (value: number) => `$${value.toFixed(2)}`,
      },
      {
        key: "estimatedTime",
        label: "Est. Time (min)",
        filterType: "none",
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user?.businessName || user?.username}!</h1>
        <Button onClick={openAdd} data-testid="button-add-service">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Services"
          value={stats.totalServices.toString()}
          Icon={Wrench}
          iconColor="text-blue-600"
          bgGradient="from-blue-500/10 to-indigo-500/10"
          data-testid="stat-active-services"
        />
        <StatCard
          title="Average Price"
          value={`$${stats.avgPrice}`}
          Icon={DollarSign}
          iconColor="text-green-600"
          bgGradient="from-green-500/10 to-teal-500/10"
          data-testid="stat-avg-price"
        />
        <StatCard
          title="Total Revenue (Monthly)"
          value={`$${stats.totalRevenue}`}
          Icon={DollarSign}
          iconColor="text-purple-600"
          bgGradient="from-purple-500/10 to-pink-500/10"
          data-testid="stat-revenue"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Services</CardTitle>
          <CardDescription>Manage your repair services and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={services}
            showActions
            renderActions={(row: Service) => (
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
          <h2 className="text-xl font-semibold">{editing ? "Edit Service" : "Add New Service"}</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Service Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Screen Replacement"
              data-testid="input-service-name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the service"
              data-testid="input-service-description"
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
                data-testid="input-service-price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Est. Time (min) *</label>
              <Input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                placeholder="60"
                data-testid="input-service-time"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4"
              data-testid="checkbox-service-active"
            />
            <label className="text-sm">Service is active and available</label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-service">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
