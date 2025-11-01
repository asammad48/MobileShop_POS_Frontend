import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import DataTable from "@/components/DataTable";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTitle } from '@/context/TitleContext';


interface SaleDetail {
  product: string;
  quantity: number;
  price: number; // Should be number
  saleTime: string; // Store as string to format later
  refund: number; // Should be number
}

export default function SalesDetailPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const {setTitle} = useTitle();
  useEffect(() => {
    setTitle(t("admin.sales_detail.title"));  
    return () => setTitle('Business Dashboard');
  }, [setTitle]);

  const [salesDetails, setSalesDetails] = useState<SaleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewItem, setViewItem] = useState<SaleDetail | null>(null);

  // Dummy data for sales details
  useEffect(() => {
    const fetchSalesDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error before fetching

        // Simulating fetching dummy data
        const dummyData: SaleDetail[] = Array.from({ length: 25 }, (_, i) => ({
          product: `Product ${i + 1}`,
          quantity: Math.floor(Math.random() * 10) + 1,
          price: parseFloat((Math.random() * 100).toFixed(2)), // Price is a number
          saleTime: new Date().toLocaleString(),
          refund: parseFloat((Math.random() * 50).toFixed(2)), // Refund is a number
        }));

        setSalesDetails(dummyData);
      } catch (error) {
        setError("Failed to load sales details.");
        toast({
          title: "Error",
          description: "Failed to load sales details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalesDetails(); // Call the function to load the data
  }, [toast]);

  // Helper function to format sale time
  const formatSaleTime = (saleTime: string) => {
    const date = new Date(saleTime);
    return date.toLocaleString(); // Format as per your requirements
  };

  // Filters
  const filteredSalesDetails = useMemo(() => {
    return salesDetails.filter((sale) => {
      const productMatch = !filters.product || sale.product.toLowerCase().includes(filters.product.toLowerCase());
      const quantityMatch = !filters.quantity || sale.quantity.toString().includes(filters.quantity);
      const refundMatch = !filters.refund || sale.refund.toString().includes(filters.refund);
      return productMatch && quantityMatch && refundMatch;
    });
  }, [salesDetails, filters]);

  const paginatedSalesDetails = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredSalesDetails.slice(start, start + limit);
  }, [filteredSalesDetails, page, limit]);

  // Columns for DataTable
  const columns = [
    { key: "index", label: "#", filterType: "none", render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1 },
    { key: "product", label: t("admin.sales_detail.columns.product"), filterType: "none" },
    { key: "quantity", label: t("admin.sales_detail.columns.quantity"), filterType: "none" },
    { key: "price", label: t("admin.sales_detail.columns.price"), filterType: "none", render: (value: number) => value.toFixed(2) },
    { key: "saleTime", label: t("admin.sales_detail.columns.sale_time"), filterType: "none" },
    { key: "refund", label: t("admin.sales_detail.columns.refund"), filterType: "none", render: (value: number) => value.toFixed(2) },
  ];

  // Handle view modal
  const handleViewItem = (item: SaleDetail) => {
    setViewItem(item);
  };

  return (
    <div className="space-y-8">

      {/* Pagination and Records per Page Dropdown */}
      <div className="flex justify-end items-center mb-4">
        <TablePageSizeSelector
          limit={limit}
          onChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1); // Reset page to 1 when page size changes
          }}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={paginatedSalesDetails}
        
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <Button size="icon" variant="ghost" onClick={() => handleViewItem(row)}>
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )}
        onFilterChange={(f) => {
          setFilters(f);
          setPage(1); // Reset to first page when filters change
        }}
      />

      {/* Pagination Controls */}
      <TablePagination
        page={page}
        limit={limit}
        total={filteredSalesDetails.length}
        onPageChange={setPage}
      />
    </div>
  );
}
