import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/context/TitleContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/DataTable";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Eye, Check, X, Package, Clock, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import StatCard from "@/components/StatCard";

type PurchaseOrder = {
  id: number;
  orderNumber: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  contactPerson: string;
  status: "pending" | "approved" | "rejected";
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
};

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export default function PurchaseOrders() {
  useAuth("wholesaler");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();

  useEffect(() => {
    setTitle("Purchase Orders");
    return () => setTitle("Dashboard");
  }, [setTitle]);

  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      orderNumber: "PO-2024-001",
      shopName: "Tech Mobile Shop",
      shopAddress: "123 Main St, Islamabad",
      shopPhone: "+92-300-1234567",
      shopEmail: "contact@techmobile.com",
      contactPerson: "Ahmed Khan",
      status: "pending",
      subtotal: 25000,
      discount: 2500,
      total: 22500,
      notes: "Please deliver within 7 days",
      createdAt: "2024-01-15T10:30:00",
      items: [
        { id: 1, productName: "iPhone Cases (Bulk - 50pcs)", quantity: 2, price: 12000, total: 24000 },
        { id: 2, productName: "USB-C Cables (Bulk - 100pcs)", quantity: 1, price: 6000, total: 6000 },
      ],
    },
    {
      id: 2,
      orderNumber: "PO-2024-002",
      shopName: "Mobile Zone Lahore",
      shopAddress: "456 Commercial Area, Lahore",
      shopPhone: "+92-321-9876543",
      shopEmail: "info@mobilezone.pk",
      contactPerson: "Sarah Ali",
      status: "approved",
      subtotal: 48000,
      discount: 4800,
      total: 43200,
      createdAt: "2024-01-14T14:20:00",
      items: [
        { id: 3, productName: "Power Banks (Bulk - 50pcs)", quantity: 3, price: 15000, total: 45000 },
        { id: 4, productName: "Screen Protectors (Bulk - 200pcs)", quantity: 1, price: 8000, total: 8000 },
      ],
    },
    {
      id: 3,
      orderNumber: "PO-2024-003",
      shopName: "Smart Accessories Hub",
      shopAddress: "789 Market Road, Karachi",
      shopPhone: "+92-333-5554444",
      shopEmail: "sales@smarthub.pk",
      contactPerson: "Bilal Ahmed",
      status: "rejected",
      subtotal: 18000,
      discount: 0,
      total: 18000,
      notes: "Urgent order needed",
      createdAt: "2024-01-13T09:15:00",
      items: [
        { id: 5, productName: "Samsung Chargers (Bulk - 100pcs)", quantity: 1, price: 18000, total: 18000 },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  const stats = useMemo(() => {
    const pending = orders.filter(o => o.status === "pending").length;
    const approved = orders.filter(o => o.status === "approved").length;
    const rejected = orders.filter(o => o.status === "rejected").length;
    const totalValue = orders.filter(o => o.status === "approved").reduce((sum, o) => sum + o.total, 0);
    
    return {
      pending,
      approved,
      rejected,
      totalValue: totalValue.toFixed(2),
    };
  }, [orders]);

  const viewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openActionModal = (order: PurchaseOrder, action: "approve" | "reject") => {
    setSelectedOrder(order);
    setActionType(action);
    setResponseNotes("");
    setIsActionModalOpen(true);
  };

  const handleAction = () => {
    if (!selectedOrder || !actionType) return;

    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: actionType === "approve" ? "approved" : "rejected" }
        : o
    ));

    toast({
      title: `Order ${actionType === "approve" ? "Approved" : "Rejected"}`,
      description: `Order ${selectedOrder.orderNumber} has been ${actionType === "approve" ? "approved" : "rejected"} successfully.`,
    });

    setIsActionModalOpen(false);
    setIsViewModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        key: "orderNumber",
        label: "Order #",
        filterType: "text" as const,
      },
      {
        key: "shopName",
        label: "Shop Name",
        filterType: "text" as const,
      },
      {
        key: "contactPerson",
        label: "Contact Person",
        filterType: "none" as const,
      },
      {
        key: "total",
        label: "Total Amount",
        filterType: "none" as const,
        render: (value: number) => `Rs. ${value.toLocaleString()}`,
      },
      {
        key: "status",
        label: "Status",
        filterType: "select" as const,
        filterOptions: ["pending", "approved", "rejected"],
        render: (value: string) => {
          const variants: Record<string, "default" | "destructive" | "secondary"> = {
            pending: "secondary",
            approved: "default",
            rejected: "destructive",
          };
          return (
            <Badge variant={variants[value] || "default"}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Badge>
          );
        },
      },
      {
        key: "createdAt",
        label: "Date",
        filterType: "none" as const,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Purchase Orders</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage incoming purchase orders from shop owners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Orders"
          value={stats.pending.toString()}
          icon={Clock}
          gradient="from-amber-500/10 to-yellow-500/10"
        />
        <StatCard
          title="Approved Orders"
          value={stats.approved.toString()}
          icon={CheckCircle}
          gradient="from-green-500/10 to-emerald-500/10"
        />
        <StatCard
          title="Rejected Orders"
          value={stats.rejected.toString()}
          icon={XCircle}
          gradient="from-red-500/10 to-rose-500/10"
        />
        <StatCard
          title="Total Value (Approved)"
          value={`Rs. ${Number(stats.totalValue).toLocaleString()}`}
          icon={ShoppingCart}
          gradient="from-blue-500/10 to-cyan-500/10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders}
            showActions
            renderActions={(row: PurchaseOrder) => (
              <div className="flex justify-end gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => viewOrder(row)}
                  data-testid={`button-view-${row.id}`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                {row.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => openActionModal(row, "approve")}
                      data-testid={`button-approve-${row.id}`}
                    >
                      <Check className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openActionModal(row, "reject")}
                      data-testid={`button-reject-${row.id}`}
                    >
                      <X className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                  </>
                )}
              </div>
            )}
            onFilterChange={() => {}}
          />
        </CardContent>
      </Card>

      <FormPopupModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedOrder.orderNumber}</h2>
              <Badge
                variant={
                  selectedOrder.status === "approved"
                    ? "default"
                    : selectedOrder.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
              >
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-base sm:text-lg">Shop Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Shop Name</p>
                  <p className="font-semibold">{selectedOrder.shopName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-semibold">{selectedOrder.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{selectedOrder.shopPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">{selectedOrder.shopEmail}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold">{selectedOrder.shopAddress}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-base sm:text-lg">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold text-base sm:text-lg">Rs. {item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm sm:text-base text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">- Rs. {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-bold">
                <span>Total:</span>
                <span>Rs. {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Notes from Shop Owner:</p>
                <p className="text-sm sm:text-base">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              {selectedOrder.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => openActionModal(selectedOrder, "reject")}
                    data-testid="button-reject-modal"
                    className="w-full sm:w-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Order
                  </Button>
                  <Button
                    onClick={() => openActionModal(selectedOrder, "approve")}
                    data-testid="button-approve-modal"
                    className="w-full sm:w-auto"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Order
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
                data-testid="button-close-view"
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </FormPopupModal>

      <FormPopupModal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)}>
        {selectedOrder && actionType && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {actionType === "approve" ? "Approve" : "Reject"} Order
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Order: {selectedOrder.orderNumber}
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Shop Name:</p>
              <p className="font-semibold text-sm sm:text-base">{selectedOrder.shopName}</p>
              <p className="text-sm text-muted-foreground mt-2 mb-1">Total Amount:</p>
              <p className="font-bold text-base sm:text-lg">Rs. {selectedOrder.total.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {actionType === "approve" ? "Confirmation Notes (Optional)" : "Reason for Rejection"}
              </label>
              <Textarea
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder={
                  actionType === "approve"
                    ? "Add any notes or delivery instructions..."
                    : "Please provide a reason for rejection..."
                }
                rows={4}
                data-testid="textarea-response-notes"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsActionModalOpen(false)}
                data-testid="button-cancel-action"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={handleAction}
                data-testid="button-confirm-action"
                className="w-full sm:w-auto"
              >
                {actionType === "approve" ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </div>
          </div>
        )}
      </FormPopupModal>
    </div>
  );
}
