import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { TablePagination } from "@/components/ui/tablepagination";
import { useToast } from "@/hooks/use-toast";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTranslation } from "react-i18next";

interface DrawerHistoryItem {
  id: number;
  date: string;
  description: string;
  seller: string;
}

export default function DrawerOpenHistory() {
  const { toast } = useToast();
  const {t} = useTranslation();

  const [drawerHistory, setDrawerHistory] = useState<DrawerHistoryItem[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      date: `2025-10-23 14:${i + 10}`,
      description: `Open drawer for stock check ${i + 1}`,
      seller: `Seller ${(i % 3) + 1}`,
    }))
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({ description: "", seller: "" });

  const filteredHistory = useMemo(() => {
    return drawerHistory.filter((item) => {
      const descriptionMatch = !filters.description || item.description.toLowerCase().includes(filters.description.toLowerCase());
      const sellerMatch = !filters.seller || item.seller === filters.seller;
      return descriptionMatch && sellerMatch;
    });
  }, [drawerHistory, filters]);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredHistory.slice(start, start + limit);
  }, [filteredHistory, page, limit]);

  const columns = [
    {
      key: "index",
      label: "#",
      filterType: "none",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    { key: "date", label: t("admin.drawer_history.columns.time"), filterType: "none" },
    { key: "description", label: t("admin.drawer_history.columns.description"), filterType: "text" },
    {
      key: "seller",
      label: t("admin.drawer_history.columns.seller"),
      filterType: "select",
      filterOptions: ["Seller 1", "Seller 2", "Seller 3"],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("admin.drawer_history.title")}</h1>
        <Button onClick={() => toast({ title: "Refresh", description: "History refreshed!" })}>
          {t("admin.drawer_history.buttons.refresh")}
        </Button>
      </div>

      <div className="flex w-full justify-end">
        <TablePageSizeSelector
          limit={limit}
          onChange={(val) => {
            setLimit(val);
            setPage(1);
          }}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedHistory}
        onFilterChange={(f) => setFilters(f)}
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        limit={limit}
        total={filteredHistory.length}
        onPageChange={setPage}
      />
    </div>
  );
}
