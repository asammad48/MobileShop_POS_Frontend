import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormPopupModal from "@/components/ui/FormPopupModal";
import DataTable from "@/components/DataTable";
import { TablePagination } from "@/components/ui/tablepagination";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTitle } from "@/context/TitleContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Category() {
  useAuth("admin");
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { toast } = useToast();

  // 🔹 Set Page Title
  useEffect(() => {
    setTitle(t("admin.sub_pages.category.title"));
    return () => setTitle("Business Dashboard");
  }, [setTitle, t]);

  // 🔹 State
  const [isGeneric, setIsGeneric] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [primaryCategories, setPrimaryCategories] = useState<any[]>([
    {
      id: 1,
      level1: "Electronics",
      level2: ["Phones", "Laptops"],
      level3: [["Android", "iPhone"], ["Gaming", "Business"]],
    },
  ]);

  const [genericCategories, setGenericCategories] = useState<any[]>([
    {
      id: 1,
      level1: "Beverages",
      level2: ["Cold Drinks"],
      level3: [["Pepsi", "Coke"]],
    },
  ]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const activeCategories = isGeneric ? genericCategories : primaryCategories;

  // 🔹 Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return activeCategories.slice(start, start + limit);
  }, [activeCategories, page, limit]);

  // 🔹 Columns
  const columns = [
    { key: "level1", label: "Level 1 Category" },
    {
      key: "level2",
      label: "Level 2 Categories",
      render: (value: string[]) => value?.join(", "),
    },
    {
      key: "level3",
      label: "Level 3 Categories",
      render: (value: string[][]) =>
        value?.flat().join(", "),
    },
  ];

  // 🔹 Handlers
  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = (cat: any) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    if (isGeneric) {
      setGenericCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } else {
      setPrimaryCategories((prev) => prev.filter((c) => c.id !== cat.id));
    }

    toast({ title: "Deleted", description: "Category deleted successfully." });
  };

  const handleSubmit = (formData: any) => {
    const newCat = {
      id: editingCategory ? editingCategory.id : Date.now(),
      ...formData,
    };

    if (editingCategory) {
      if (isGeneric) {
        setGenericCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? newCat : c))
        );
      } else {
        setPrimaryCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? newCat : c))
        );
      }
      toast({ title: "Updated", description: "Category updated successfully." });
    } else {
      if (isGeneric) setGenericCategories((prev) => [...prev, newCat]);
      else setPrimaryCategories((prev) => [...prev, newCat]);
      toast({ title: "Added", description: "Category created successfully." });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isGeneric}
            onCheckedChange={(checked) => setIsGeneric(Boolean(checked))}
            id="genericSwitch"
          />
          <label htmlFor="genericSwitch" className="text-sm">
            {isGeneric ? "Generic Category" : "Primary Category"}
          </label>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* ---------- TABLE ---------- */}
      <DataTable
        columns={columns}
        data={paginatedData}
        showActions
        renderActions={(row) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEdit(row)}
              className="text-blue-500"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(row)}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* ---------- PAGINATION ---------- */}
      <div className="flex justify-between items-center">
        <TablePageSizeSelector
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
        />
        <TablePagination
          page={page}
          limit={limit}
          total={activeCategories.length}
          onPageChange={setPage}
        />
      </div>

      {/* ---------- MODAL ---------- */}
      <FormPopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          onSubmit={handleSubmit}
          initialData={editingCategory}
        />
      </FormPopupModal>
    </div>
  );
}

/* -------------------------------------------------------------
   CategoryForm Component (Internal)
------------------------------------------------------------- */
function CategoryForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  const [level1, setLevel1] = useState(initialData?.level1 || "");
  const [level2List, setLevel2List] = useState<string[]>(
    initialData?.level2 || [""]
  );
  const [level3List, setLevel3List] = useState<string[][]>(
    initialData?.level3 || [[]]
  );

  const handleLevel2Change = (idx: number, value: string) => {
    const copy = [...level2List];
    copy[idx] = value;
    setLevel2List(copy);
  };

  const handleLevel3Change = (lvl2Idx: number, lvl3Idx: number, value: string) => {
    const copy = [...level3List];
    copy[lvl2Idx][lvl3Idx] = value;
    setLevel3List(copy);
  };

  const addLevel2 = () => {
    setLevel2List((prev) => [...prev, ""]);
    setLevel3List((prev) => [...prev, []]);
  };

  const addLevel3 = (lvl2Idx: number) => {
    setLevel3List((prev) => {
      const copy = [...prev];
      copy[lvl2Idx] = [...(copy[lvl2Idx] || []), ""];
      return copy;
    });
  };

  const handleSubmit = () => {
    if (!level1.trim()) {
      alert("Level 1 Category is required");
      return;
    }
    onSubmit({ level1, level2: level2List, level3: level3List });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Level 1 Category</label>
        <Input
          value={level1}
          onChange={(e) => setLevel1(e.target.value)}
          placeholder="Enter Level 1 category"
          className="mt-1"
        />
      </div>

      {level2List.map((lvl2, i) => (
        <div key={i} className="space-y-2 border p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Level 2 Category</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addLevel3(i)}
            >
              + Add Level 3
            </Button>
          </div>
          <Input
            value={lvl2}
            onChange={(e) => handleLevel2Change(i, e.target.value)}
            placeholder="Enter Level 2 category"
          />
          {level3List[i]?.map((lvl3, j) => (
            <Input
              key={j}
              value={lvl3}
              onChange={(e) => handleLevel3Change(i, j, e.target.value)}
              placeholder="Enter Level 3 category"
              className="ml-4 mt-2"
            />
          ))}
        </div>
      ))}

      <Button variant="secondary" onClick={addLevel2}>
        + Add Another Level 2
      </Button>

      <div className="pt-4 text-right">
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}
