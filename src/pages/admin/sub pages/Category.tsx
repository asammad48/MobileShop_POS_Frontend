import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormPopupModal from "@/components/ui/FormPopupModal";
import DataTable from "@/components/DataTable";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTitle } from "@/context/TitleContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

type CategoryType = "primary" | "generic";

type Level3 = string;

type Level2 = {
  id: string;
  name: string;
  level3: Level3[];
};

type Category = {
  id: number;
  name: string; // Level 1
  level2: Level2[];
};

export default function Category() {
  useAuth("admin");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();

  // set title once on mount (safe)
  useEffect(() => {
    setTitle(t("admin.sub_pages.category.title") || "Categories");
    return () => setTitle("Business Dashboard");
    // intentionally empty deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI state
  const [activeType, setActiveType] = useState<CategoryType>("primary");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  // Initialize mock data as arrays (always arrays)
  const [primaryCategories, setPrimaryCategories] = useState<Category[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Primary ${i + 1}`,
        level2: [
          { id: `p-${i + 1}-a`, name: `P${i + 1}-L2-A`, level3: ["A1", "A2"] },
          { id: `p-${i + 1}-b`, name: `P${i + 1}-L2-B`, level3: ["B1"] },
        ],
      }))
  );

  const [genericCategories, setGenericCategories] = useState<Category[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Generic ${i + 1}`,
        level2: [{ id: `g-${i + 1}-1`, name: `G${i + 1}-L2-1`, level3: ["X"] }],
      }))
  );

  // Helpers for active list
  const activeList = activeType === "primary" ? primaryCategories : genericCategories;
  const setActiveList = (list: Category[]) => {
    if (activeType === "primary") setPrimaryCategories(list);
    else setGenericCategories(list);
  };

  // search + filtered + paginated (memoized)
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!Array.isArray(activeList)) return [];
    if (!search) return activeList;
    return activeList.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeList, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  // simple local id generator for Level2 items
  const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  // modal form state
  const emptyLevel2 = (): Level2 => ({ id: makeId(), name: "", level3: [] });
  const [form, setForm] = useState<{ name: string; level2: Level2[] }>({ name: "", level2: [emptyLevel2()] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // open add / edit modal
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", level2: [emptyLevel2()] });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    // deep copy to avoid mutation
    setForm({ name: cat.name, level2: cat.level2.map((l) => ({ ...l, level3: [...l.level3] })) });
    setErrors({});
    setIsModalOpen(true);
  };

  // form helpers
  const updateLevel2Name = (idx: number, value: string) =>
    setForm((f) => ({ ...f, level2: f.level2.map((l, i) => (i === idx ? { ...l, name: value } : l)) }));

  const addLevel2 = () => setForm((f) => ({ ...f, level2: [...f.level2, emptyLevel2()] }));

  const removeLevel2 = (idx: number) => setForm((f) => ({ ...f, level2: f.level2.filter((_, i) => i !== idx) }));

  const addLevel3 = (l2Idx: number) =>
    setForm((f) => ({ ...f, level2: f.level2.map((l, i) => (i === l2Idx ? { ...l, level3: [...l.level3, ""] } : l)) }));

  const updateLevel3 = (l2Idx: number, l3Idx: number, value: string) =>
    setForm((f) => ({
      ...f,
      level2: f.level2.map((l, i) => (i === l2Idx ? { ...l, level3: l.level3.map((v, j) => (j === l3Idx ? value : v)) } : l)),
    }));

  const removeLevel3 = (l2Idx: number, l3Idx: number) =>
    setForm((f) => ({ ...f, level2: f.level2.map((l, i) => (i === l2Idx ? { ...l, level3: l.level3.filter((_, j) => j !== l3Idx) } : l)) }));

  // validation & submit
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "This field is required";
    const exists = activeList.some(
      (c) => c.name.toLowerCase() === form.name.trim().toLowerCase() && (!editing || c.id !== editing.id)
    );
    if (exists) e.name = "Level 1 name must be unique for this category type";

    form.level2.forEach((l, idx) => {
      if (!l.name.trim()) e[`l2-${idx}`] = "Level 2 name required";
      l.level3.forEach((v, j) => {
        if (!v.trim()) e[`l3-${idx}-${j}`] = "Level 3 name required";
      });
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) {
      toast({ title: "Fix errors before saving", variant: "destructive" });
      return;
    }

    if (editing) {
      const updated = activeList.map((c) => (c.id === editing.id ? { ...c, name: form.name.trim(), level2: form.level2 } : c));
      setActiveList(updated);
      toast({ title: "Category updated" });
    } else {
      const newCat: Category = {
        id: Math.max(0, ...activeList.map((c) => c.id)) + 1,
        name: form.name.trim(),
        level2: form.level2,
      };
      setActiveList([...(activeList || []), newCat]);
      toast({ title: "Category added" });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    const updated = activeList.filter((c) => c.id !== cat.id);
    setActiveList(updated);
    toast({ title: "Category deleted" });
  };

  // columns — memoized; avoid unstable deps (do not include `t`)
  const columns = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        filterType: "none",
        render: (_: any, __: any, idx: number) => (page - 1) * limit + idx + 1,
      },
      { key: "name", label: t("admin.sub_pages.category.level1") || "Level 1", filterType: "text" },
      {
        key: "level2",
        label: t("admin.sub_pages.category.level2") || "Level 2",
        filterType: "none",
        // DataTable will pass row['level2'] as `value`
        render: (value: Level2[]) => <div className="max-w-xs truncate">{(value || []).map((l) => l.name).join(", ")}</div>,
      },
      {
        key: "level3",
        label: t("admin.sub_pages.category.level3") || "Level 3",
        filterType: "none",
        // DataTable passes value,row,index — we need row to flatten level3
        render: (_value: any, row: Category) => (
          <div className="max-w-xs truncate">{(row.level2 || []).flatMap((l) => l.level3).join(", ")}</div>
        ),
      },
    ],
    // only re-create when page or limit change (safe)
    [page, limit, t]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={activeType === "generic"}
              onChange={(e) => {
                setActiveType(e.target.checked ? "generic" : "primary");
                setPage(1);
              }}
              className="h-4 w-4"
            />
            <span className="text-sm">Show Generic Categories</span>
          </label>

          <Input
            placeholder={t("search") || "Search by Level 1"}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
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
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.sub_pages.category.add_button") || "Add Category"}
          </Button>
        </div>
      </div>

      {/* Table — render only when paginated is an array */}
      {Array.isArray(paginated) && (
        <DataTable
          columns={columns}
          data={paginated}
          showActions
          renderActions={(row: Category) => (
            <div className="flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(row)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
          onFilterChange={() => {
            // we handle filters outside DataTable for now
          }}
        />
      )}

      <TablePagination page={page} limit={limit} total={filtered.length} onPageChange={setPage} />

      {/* Modal */}
      <FormPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">{editing ? "Edit Category" : "Add Category"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Level 1 (unique)</label>
            <Input name="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Level 2 (add one or more)</label>
              <Button type="button" size="sm" onClick={addLevel2}>
                Add Level 2
              </Button>
            </div>

            {form.level2.map((l2, l2Idx) => (
              <div key={l2.id} className="border rounded p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <label className="block mb-1">Level 2 name</label>
                    <Input value={l2.name} onChange={(e) => updateLevel2Name(l2Idx, e.target.value)} />
                    {errors[`l2-${l2Idx}`] && <p className="text-red-500 text-sm mt-1">{errors[`l2-${l2Idx}`]}</p>}

                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Level 3 (subcategories)</label>
                        <Button type="button" size="sm" onClick={() => addLevel3(l2Idx)}>
                          Add Level 3
                        </Button>
                      </div>

                      <div className="space-y-2 mt-2">
                        {l2.level3.map((l3, l3Idx) => (
                          <div key={`${l2.id}-l3-${l3Idx}`} className="flex gap-2 items-center">
                            <Input value={l3} onChange={(e) => updateLevel3(l2Idx, l3Idx, e.target.value)} />
                            <Button type="button" variant="ghost" onClick={() => removeLevel3(l2Idx, l3Idx)} size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            {errors[`l3-${l2Idx}-${l3Idx}`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`l3-${l2Idx}-${l3Idx}`]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" onClick={() => removeLevel2(l2Idx)}>
                      Remove L2
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Update Category" : "Add Category"}</Button>
          </div>
        </form>
      </FormPopupModal>
    </div>
  );
}
