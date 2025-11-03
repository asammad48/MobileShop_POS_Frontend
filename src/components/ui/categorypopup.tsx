import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormPopupModal from "@/components/ui/FormPopupModal";

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

  const handleSubmit = () => {
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
      <form onSubmit={() => handleSubmit()} className="space-y-6">
        {/* LEVEL 1 */}
        <div>
          <label className="block font-medium mb-2">Level 1 Categories</label>

          {level1Categories.map((cat, l1Index) => (
            <div key={l1Index} className="border rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <Input
                  placeholder={`Level 1 Category ${l1Index + 1}`}
                  value={cat.name}
                  onChange={(e) => updateLevel1Name(l1Index, e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedL1(expandedL1 === l1Index ? null : l1Index)
                    }
                  >
                    {expandedL1 === l1Index ? "Hide Subcategories" : "Add Subcategory"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLevel1Category(l1Index)}
                  >
                    ❌
                  </Button>
                </div>
              </div>

              {/* LEVEL 2 */}
              {expandedL1 === l1Index && (
                <div className="mt-4 border-t pt-3 space-y-3">
                  <p className="font-medium">Level 2 Categories</p>
                  {cat.level2.map((l2, l2Index) => (
                    <div key={l2Index} className="border rounded-md p-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder={`Level 2 Category ${l2Index + 1}`}
                          value={l2.name}
                          onChange={(e) =>
                            updateLevel2Name(l1Index, l2Index, e.target.value)
                          }
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setExpandedL2(
                                expandedL2 === `${l1Index}-${l2Index}`
                                  ? null
                                  : `${l1Index}-${l2Index}`
                              )
                            }
                          >
                            {expandedL2 === `${l1Index}-${l2Index}`
                              ? "Hide Subcategories"
                              : "Add Subcategory"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLevel2Category(l1Index, l2Index)}
                          >
                            ❌
                          </Button>
                        </div>
                      </div>

                      {/* LEVEL 3 */}
                      {expandedL2 === `${l1Index}-${l2Index}` && (
                        <div className="mt-3 ml-4 border-l pl-3 space-y-2">
                          {l2.level3.map((l3, l3Index) => (
                            <div key={l3Index} className="flex gap-2 items-center">
                              <Input
                                placeholder={`Level 3 Category ${l3Index + 1}`}
                                value={l3.name}
                                onChange={(e) =>
                                  updateLevel3Name(
                                    l1Index,
                                    l2Index,
                                    l3Index,
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeLevel3Category(l1Index, l2Index, l3Index)
                                }
                              >
                                ❌
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addLevel3Category(l1Index, l2Index)}
                          >
                            ➕ Add Level 3
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addLevel2Category(l1Index)}
                  >
                    ➕ Add Level 2
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            size="sm"
            variant="secondary"
            onClick={addLevel1Category}
            className="mt-2"
          >
            ➕ Add Level 1
          </Button>
        </div>
        <div className="flex justify-end">
            <Button
            variant="default"
            type="submit"
            >
                Create
            </Button>

        </div>
      </form>
    </FormPopupModal>
  );
}
