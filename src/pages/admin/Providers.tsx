import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTranslation } from "react-i18next";
import { createRoot } from "react-dom/client";
import { printElement } from "@/utils/print"; // ✅ import reusable print utility

export default function Providers() {
  const [viewingProvider, setViewingProvider] = useState<any | null>(null);
  const { t } = useTranslation();
  useAuth("admin");
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [providers, setProviders] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Provider ${i + 1}`,
      phone: `+34 346 486 83${i + 1}`,
      document: `DOC-${1000 + i}`,
      location: "Germany",
      type: "Laptop",
      balance: i % 2 === 0 ? i * 10 : -i * 5,
    }))
  );

  const paginatedProviders = useMemo(() => {
    const start = (page - 1) * limit;
    return providers.slice(start, start + limit);
  }, [providers, page, limit]);

  const columns = [
    {
      key: "index",
      label: t("admin.providers.columns.index"),
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    { key: "name", label: t("admin.providers.columns.name") },
    { key: "phone", label: t("admin.providers.columns.phone") },
    { key: "location", label: t("admin.providers.columns.location") },
    { key: "type", label: t("admin.providers.columns.type") },
    { key: "document", label: t("admin.providers.columns.document") },
    {
      key: "balance",
      label: t("admin.providers.columns.balance"),
      render: (value: number) =>
        value < 0 ? (
          <Badge variant="destructive">{value.toFixed(2)}</Badge>
        ) : (
          <Badge variant="default">+{value.toFixed(2)}</Badge>
        ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProvider, setEditProvider] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newProvider = {
      id: providers.length + 1,
      name: formData.get("name") as string,
      document: formData.get("document") as string,
      balance: parseFloat(formData.get("balance") as string) || 0,
    };
    setProviders([...providers, newProvider]);
    setIsModalOpen(false);
    toast({
      title: t("admin.providers.toasts.title_added"),
      description: t("admin.providers.toasts.added", {
        name: newProvider.name,
      }),
    });
  };

  const handleView = (row: any) => {
    setViewingProvider(row);
  };

  //  Handle Print
  const handlePrint = async (provider: any) => {
    const container = document.createElement("div");
    container.id = "printable-provider";
    document.body.appendChild(container);
  
    const root = createRoot(container);
  
    root.render(
      <div
        id="printable-provider"
        className="p-10 bg-white text-black font-sans max-w-[8.5in] mx-auto"
        style={{ width: "8.5in", minHeight: "11in" }}
      >
        <header className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold mb-1">Provider Information</h1>
          <p className="text-gray-600 text-sm">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </header>
  
        <section>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {Object.entries({
                Name: provider.name,
                Phone: provider.phone,
                Location: provider.location,
                Type: provider.type,
                "CIF/DNI/PASSPORT": provider.document,
                Balance: `${provider.balance.toFixed(2)} €`,
              }).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="font-semibold text-gray-700 py-2 pr-3 w-1/3">
                    {key}
                  </td>
                  <td className="text-gray-800 py-2">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
  
        <footer className="mt-8 border-t pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sell POS System
        </footer>
      </div>
    );
  
    // ✅ Wait for React to flush DOM updates before printing
    await new Promise((resolve) => setTimeout(resolve, 400));
  
    await printElement("printable-provider", {
      title: `Provider - ${provider.name}`,
      onAfterPrint: () => {
        root.unmount();
        document.body.removeChild(container);
      },
    });
  };
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            {t("admin.providers.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.providers.subtitle")}
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
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create New Provider
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedProviders}
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
              onClick={() => handlePrint(row)}
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        limit={limit}
        total={providers.length}
        onPageChange={setPage}
      />

      {/* View Provider Modal */}
      {viewingProvider && (
        <div className="fixed !m-0 inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[700px] relative shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Provider Information</h2>

            <div className="space-y-3 text-sm text-gray-800">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <p className="text-gray-500 font-medium">Name</p>
                  <p className="font-semibold">{viewingProvider.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Phone</p>
                  <p>{viewingProvider.phone}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">Location</p>
                  <p>{viewingProvider.location}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Type</p>
                  <p>{viewingProvider.type}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">CIF / DNI / Passport</p>
                  <p>{viewingProvider.document}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">Balance</p>
                  <p
                    className={`font-semibold ${
                      viewingProvider.balance < 0
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    €{viewingProvider.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 no-print">
              <Button
                variant="outline"
                onClick={() => setViewingProvider(null)}
              >
                Close
              </Button>
              <Button onClick={() => handlePrint(viewingProvider)}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <FormPopupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditProvider(null);
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editProvider ? "Edit Provider" : "Add New Provider"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Provider Name</Label>
            <Input
              name="name"
              defaultValue={editProvider?.name || ""}
              placeholder="Enter provider name"
              required
            />
          </div>

          <div>
            <Label>CIF / DNI / Passport</Label>
            <Input
              name="document"
              defaultValue={editProvider?.document || ""}
              placeholder="Enter document number"
            />
          </div>

          <div>
            <Label>Opening Balance</Label>
            <Input
              name="balance"
              type="number"
              step="0.01"
              defaultValue={editProvider?.balance || 0}
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
              {editProvider ? "Update Provider" : "Add Provider"}
            </Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
