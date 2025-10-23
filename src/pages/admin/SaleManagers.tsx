import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface SalesManager {
  id: number;
  name: string;
  email: string;
  phone: string;
  store: string;
}

export default function SalesManagers() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Define the available plans and the limits for sales managers
  const [planType, setPlanType] = useState<"basic" | "pro">("basic");  // default to basic plan
  const [maxSalesManagers, setMaxSalesManagers] = useState(2);  // Limit based on plan (e.g., Basic = 2)

  // Example sales manager data
  const [salesManagers, setSalesManagers] = useState<SalesManager[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123456789", store: "Store 1" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", store: "" });

  // Function to handle form data changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (salesManagers.length >= maxSalesManagers) {
      toast({ title: "Limit Reached", description: `You can only add ${maxSalesManagers} Sales Managers in your current plan.` });
      return;
    }

    const newSalesManager: SalesManager = {
      id: salesManagers.length + 1,
      ...formData
    };
    
    setSalesManagers([...salesManagers, newSalesManager]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "", store: "" });
    toast({ title: "Sales Manager Added", description: `${newSalesManager.name} has been added successfully.` });
  };

  // Columns for the data table
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "store", label: "Store" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{t("admin.sales_managers.title")}</h1>
      </div>

      {/* Available Sales Manager Limit Info */}
      <div className="bg-blue-100 p-4 rounded-md">
        <p className="text-lg">{`You can add up to ${maxSalesManagers} Sales Managers in your current plan.`}</p>
        <p className="text-sm">{`Current number of sales managers: ${salesManagers.length}`}</p>
      </div>

      {/* DataTable for Existing Sales Managers */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 border">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {salesManagers.map((manager) => (
            <tr key={manager.id}>
              <td className="px-4 py-2 border">{manager.id}</td>
              <td className="px-4 py-2 border">{manager.name}</td>
              <td className="px-4 py-2 border">{manager.email}</td>
              <td className="px-4 py-2 border">{manager.phone}</td>
              <td className="px-4 py-2 border">{manager.store}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to Open the "Add Sales Manager" Modal */}
      <Button onClick={() => setIsModalOpen(true)} disabled={salesManagers.length >= maxSalesManagers}>
        Add Sales Manager
      </Button>

      {/* Modal to Add Sales Manager */}
      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold">Add Sales Manager</h2>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label>Store</Label>
            <Input name="store" value={formData.store} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={salesManagers.length >= maxSalesManagers}>
              Add Manager
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
