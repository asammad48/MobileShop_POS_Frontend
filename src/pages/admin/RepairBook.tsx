/* 

repair person

*/

import React, { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/tablepagination";
import { printElement } from "@/utils/print";
import { useTranslation } from "react-i18next";


interface RepairItem {
    id: number;
    date: string;
    brand: string;
    model: string;
    imei: string;
    defect: string;
    description: string;
    repairperson: string,
    customer: string;
    dni: string;
    status: string;
}

export default function RepairBook() {
    useAuth("admin");
    const { toast } = useToast();
    const {t} = useTranslation();

    const [repairs, setRepairs] = useState(
        Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            date: "2025-10-21 14:23",
            brand: "Samsung",
            model: "S22 Ultra",
            imei: `358973XXXXXX12${i}`,
            defect: "Screen broken",
            description: "Screen shattered after a fall, needs replacement.",
            repairperson: `Shop ${(i % 3) + 1}`,
            customer: "Ali Khan",
            dni: `PK12345${i}`,
            status: "registered",
            
        })));

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [viewItem, setViewItem] = useState<RepairItem | null>(null);
    const [editItem, setEditItem] = useState<RepairItem | null>(null);

    // Filters
    const filteredRepairs = useMemo(() => {
        return repairs.filter((r) => {
            const brandMatch = !filters.brand || r.brand.toLowerCase().includes(filters.brand.toLowerCase());
            const modelMatch = !filters.model || r.model.toLowerCase().includes(filters.model.toLowerCase());
            const imeiMatch = !filters.imei || r.imei.toLowerCase().includes(filters.imei.toLowerCase());
            const defectMatch = !filters.defect || r.defect.toLowerCase().includes(filters.defect.toLowerCase());
            const customerMatch = !filters.customer || r.customer.toLowerCase().includes(filters.customer.toLowerCase());
            const dniMatch = !filters.dni || r.dni.toLowerCase().includes(filters.dni.toLowerCase());
            const statusMatch = !filters.status || r.status === filters.status;
            return brandMatch && modelMatch && imeiMatch && defectMatch && customerMatch && dniMatch && statusMatch;
        });
    }, [repairs, filters]);

    const paginatedRepairs = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredRepairs.slice(start, start + limit);
    }, [filteredRepairs, page, limit]);

    // Columns
    const columns = [
        {
            key: "index",
            label: "#",
            filterType: "none",
            render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
        },
        { key: "date", label: t("admin.repair_book.columns.date"), filterType: "none" },
        { key: "model", label: t("admin.repair_book.columns.brand"), filterType: "text" },
        { key: "imei", label: t("admin.repair_book.columns.imei"), filterType: "text" },
        { key: "defect", label: t("admin.repair_book.columns.defect"), filterType: "text" },
        { key: "customer", label: t("admin.repair_book.columns.customer_name"), filterType: "text" },
        { key: "dni", label: t("admin.repair_book.columns.identification"), filterType: "text" },
        {
            key: "status",
            label: t("admin.repair_book.columns.status.title"),
            filterType: "select",
            filterOptions: [t("admin.repair_book.columns.status.registered"), t("admin.repair_book.columns.status.not_registered")],
        },
        {
            key: "repairperson",
            label: "Repair Person",
            filterType: "select",
            filterOptions: ["Shop 1", "Shop 2", "Shop 3"]
        }
    ];

    // Edit submit
    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editItem) return;
        setRepairs((prev) => prev.map((r) => (r.id === editItem.id ? editItem : r)));
        setEditItem(null);
        toast({ title: "Repair Updated", description: "Repair details updated successfully." });
    };

    const handlePrintRow = async (row: any) => {
        const container = document.createElement("div");
        container.id = "product-print-container";
        container.innerHTML = `<div style="padding:30px;">         <h2>Product Details</h2>         <table><tbody>
      ${Object.entries({
            Category: row.category,
            "Product Name": row.name,
            "EAN/SKU/UPC": row.ean,
            "Stock": row.stock,
            "Buy Price": row.buyPrice,
            "Sale Price": row.salePrice,
        })
                .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
                .join("")}         </tbody></table>       </div>`;
        document.body.appendChild(container);
        await printElement("product-print-container", {
            title: `Product - ${row.name}`,
            onAfterPrint: () => document.body.removeChild(container),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Repair Book</h1>
            </div>

            <DataTable
                columns={columns}
                data={paginatedRepairs}
                showActions
                renderActions={(row) => (
                    <div className="flex justify-end gap-1 relative z-10">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setViewItem(row);
                            }}
                            title="View"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditItem(row);
                            }}
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    </div>
                )}
                onFilterChange={(f) => {
                    setFilters(f);
                    setPage(1);
                }}
            />
            {/* Pagination */}
            <TablePagination
                page={page}
                limit={limit}
                total={filteredRepairs.length}
                onPageChange={setPage}
            />

            {/* View Modal */}
            <FormPopupModal isOpen={!!viewItem} onClose={() => setViewItem(null)}>
                {viewItem && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Repair Details</h2>
                        <p><b>Date:</b> {viewItem.date}</p>
                        <p><b>Brand:</b> {viewItem.brand}</p>
                        <p><b>Model:</b> {viewItem.model}</p>
                        <p><b>IMEI/Serial:</b> {viewItem.imei}</p>
                        <p><b>Defect:</b> {viewItem.defect}</p>
                        <p><b>Description:</b> {viewItem.description}</p>
                        <p><b>Customer:</b> {viewItem.customer}</p>
                        <p><b>DNI/NIE/PASSPORT:</b> {viewItem.dni}</p>
                        <p><b>Status:</b> {viewItem.status}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
                            <Button onClick={() => handlePrintRow(viewItem)}>Print</Button>
                        </div>
                    </div>
                )}
            </FormPopupModal>

            {/* Edit Modal */}
            <FormPopupModal isOpen={!!editItem} onClose={() => setEditItem(null)}>
                {editItem && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-2">Edit Repair</h2>
                        <div>
                            <Label>Brand</Label>
                            <Input
                                value={editItem.brand}
                                onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Model</Label>
                            <Input
                                value={editItem.model}
                                onChange={(e) => setEditItem({ ...editItem, model: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Defect</Label>
                            <Input
                                value={editItem.defect}
                                onChange={(e) => setEditItem({ ...editItem, defect: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={editItem.status}
                                onValueChange={(value) => setEditItem({ ...editItem, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="registered">Registered</SelectItem>
                                    <SelectItem value="not registered">Not Registered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                )}
            </FormPopupModal>
        </div>
    );
}
