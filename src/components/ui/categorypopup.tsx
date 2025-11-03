import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormPopupModal from "@/components/ui/FormPopupModal";
import { useTranslation } from "react-i18next";
import { Plus, X, ChevronDown, ChevronRight } from "lucide-react";

interface Level3 {
  name: string;
}

interface Level2 {
  id?: string;
  name: string;
  level3: Level3[];
}

interface Category {
  name: string;
  level2: Level2[];
}

export default function CategoryPopup({
  open,
  onClose,
  isGeneric,
  initialData,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  isGeneric: boolean;
  initialData?: Category[];
  onSubmit: (data: Category[]) => void;
}) {
  const { t } = useTranslation();
  const [level1Categories, setLevel1Categories] = useState<Category[]>([]);
  const [expandedL1, setExpandedL1] = useState<number | null>(null);
  const [expandedL2, setExpandedL2] = useState<string | null>(null);

  // Update when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      setLevel1Categories(initialData || []);
      if (initialData && initialData.length > 0) {
        setExpandedL1(0);
      }
    }
  }, [open, initialData]);

  // ---------- Level 1 ----------
  const addLevel1Category = () => {
    setLevel1Categories((prev) => [...prev, { name: "", level2: [] }]);
  };

  const updateLevel1Name = (l1Index: number, value: string) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) => (i === l1Index ? { ...cat, name: value } : cat))
    );
  };

  const removeLevel1Category = (l1Index: number) => {
    setLevel1Categories((prev) => prev.filter((_, i) => i !== l1Index));
  };

  // ---------- Level 2 ----------
  const addLevel2Category = (l1Index: number) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? { ...cat, level2: [...cat.level2, { name: "", level3: [] }] }
          : cat
      )
    );
  };

  const updateLevel2Name = (l1Index: number, l2Index: number, value: string) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? {
              ...cat,
              level2: cat.level2.map((l2, j) =>
                j === l2Index ? { ...l2, name: value } : l2
              ),
            }
          : cat
      )
    );
  };

  const removeLevel2Category = (l1Index: number, l2Index: number) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? {
              ...cat,
              level2: cat.level2.filter((_, j) => j !== l2Index),
            }
          : cat
      )
    );
  };

  // ---------- Level 3 ----------
  const addLevel3Category = (l1Index: number, l2Index: number) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? {
              ...cat,
              level2: cat.level2.map((l2, j) =>
                j === l2Index
                  ? { ...l2, level3: [...l2.level3, { name: "" }] }
                  : l2
              ),
            }
          : cat
      )
    );
  };

  const updateLevel3Name = (
    l1Index: number,
    l2Index: number,
    l3Index: number,
    value: string
  ) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? {
              ...cat,
              level2: cat.level2.map((l2, j) =>
                j === l2Index
                  ? {
                      ...l2,
                      level3: l2.level3.map((l3, k) =>
                        k === l3Index ? { ...l3, name: value } : l3
                      ),
                    }
                  : l2
              ),
            }
          : cat
      )
    );
  };

  const removeLevel3Category = (l1Index: number, l2Index: number, l3Index: number) => {
    setLevel1Categories((prev) =>
      prev.map((cat, i) =>
        i === l1Index
          ? {
              ...cat,
              level2: cat.level2.map((l2, j) =>
                j === l2Index
                  ? {
                      ...l2,
                      level3: l2.level3.filter((_, k) => k !== l3Index),
                    }
                  : l2
              ),
            }
          : cat
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(level1Categories);
    setLevel1Categories([]);
    setExpandedL1(null);
    setExpandedL2(null);
    onClose();
  };

  return (
    <FormPopupModal
      isOpen={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">
          {initialData && initialData.length > 0 
            ? t("admin.sub_pages.category.modal.edit_title") 
            : t("admin.sub_pages.category.modal.add_title")
          }
        </h2>
        {/* LEVEL 1 */}
        <div>
          <label className="block font-medium mb-2 text-sm">{t("admin.sub_pages.category.level1")}</label>

          {level1Categories.map((cat, l1Index) => (
            <div key={l1Index} className="border rounded-lg p-4 mb-3 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  placeholder={t("admin.sub_pages.category.modal.category_name_placeholder")}
                  value={cat.name}
                  onChange={(e) => updateLevel1Name(l1Index, e.target.value)}
                  className="flex-1"
                  data-testid={`input-level1-${l1Index}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedL1(expandedL1 === l1Index ? null : l1Index)
                  }
                  data-testid={`button-toggle-level2-${l1Index}`}
                >
                  {expandedL1 === l1Index ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLevel1Category(l1Index)}
                  data-testid={`button-remove-level1-${l1Index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* LEVEL 2 */}
              {expandedL1 === l1Index && (
                <div className="mt-3 pl-4 border-l-2 border-primary/30 space-y-2">
                  <p className="font-medium text-sm text-muted-foreground">{t("admin.sub_pages.category.level2")}</p>
                  {cat.level2.map((l2, l2Index) => (
                    <div key={l2Index} className="border rounded-md p-3 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder={t("admin.sub_pages.category.modal.level2_placeholder")}
                          value={l2.name}
                          onChange={(e) =>
                            updateLevel2Name(l1Index, l2Index, e.target.value)
                          }
                          className="flex-1"
                          data-testid={`input-level2-${l1Index}-${l2Index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedL2(
                              expandedL2 === `${l1Index}-${l2Index}`
                                ? null
                                : `${l1Index}-${l2Index}`
                            )
                          }
                          data-testid={`button-toggle-level3-${l1Index}-${l2Index}`}
                        >
                          {expandedL2 === `${l1Index}-${l2Index}`
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLevel2Category(l1Index, l2Index)}
                          data-testid={`button-remove-level2-${l1Index}-${l2Index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* LEVEL 3 */}
                      {expandedL2 === `${l1Index}-${l2Index}` && (
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 space-y-2">
                          <p className="font-medium text-xs text-muted-foreground">{t("admin.sub_pages.category.level3")}</p>
                          {l2.level3.map((l3, l3Index) => (
                            <div key={l3Index} className="flex gap-2 items-center">
                              <Input
                                placeholder={t("admin.sub_pages.category.modal.level3_placeholder")}
                                value={l3.name}
                                onChange={(e) =>
                                  updateLevel3Name(
                                    l1Index,
                                    l2Index,
                                    l3Index,
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                                data-testid={`input-level3-${l1Index}-${l2Index}-${l3Index}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeLevel3Category(l1Index, l2Index, l3Index)
                                }
                                data-testid={`button-remove-level3-${l1Index}-${l2Index}-${l3Index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => addLevel3Category(l1Index, l2Index)}
                            className="w-full"
                            data-testid={`button-add-level3-${l1Index}-${l2Index}`}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {t("admin.sub_pages.category.modal.add_level3")}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => addLevel2Category(l1Index)}
                    className="w-full"
                    data-testid={`button-add-level2-${l1Index}`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("admin.sub_pages.category.modal.add_level2")}
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={addLevel1Category}
            className="mt-2 w-full"
            data-testid="button-add-level1"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.sub_pages.category.modal.add_level2").replace("Level 2", "Level 1")}
          </Button>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="button-cancel-category"
          >
            {t("admin.sub_pages.category.modal.cancel")}
          </Button>
          <Button
            variant="default"
            type="submit"
            data-testid="button-submit-category"
          >
            {initialData && initialData.length > 0 
              ? t("admin.sub_pages.category.modal.update") 
              : t("admin.sub_pages.category.modal.save")
            }
          </Button>
        </div>
      </form>
    </FormPopupModal>
  );
}
