import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
}

interface QuickProductsDialogProps {
  products: Product[];
  selectedIds: string[];
  maxSelections: number;
  onSave: (selectedIds: string[]) => void;
}

export function QuickProductsDialog({
  products,
  selectedIds,
  maxSelections,
  onSave,
}: QuickProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSelection, setLocalSelection] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedIds);
    }
  }, [open, selectedIds]);

  const handleToggle = (productId: string) => {
    if (localSelection.includes(productId)) {
      setLocalSelection(localSelection.filter(id => id !== productId));
    } else {
      if (localSelection.length >= maxSelections) {
        return;
      }
      setLocalSelection([...localSelection, productId]);
    }
  };

  const handleSave = () => {
    onSave(localSelection);
    setOpen(false);
  };

  const isAtLimit = localSelection.length >= maxSelections;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-manage-quick-products">
          <Settings className="w-4 h-4 mr-2" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Manage Quick Products
          </DialogTitle>
          <DialogDescription>
            Select up to {maxSelections} frequently used products. Current selection: {localSelection.length}/{maxSelections}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 pb-2">
          <Badge variant={isAtLimit ? 'destructive' : 'secondary'}>
            {localSelection.length}/{maxSelections} {isAtLimit && '(Max reached)'}
          </Badge>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {products.map((product) => {
              const isSelected = localSelection.includes(product.id);
              const isDisabled = !isSelected && isAtLimit;

              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-md border hover-elevate ${
                    isDisabled ? 'opacity-50' : ''
                  }`}
                  data-testid={`quick-product-option-${product.id}`}
                >
                  <Checkbox
                    id={`quick-${product.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(product.id)}
                    disabled={isDisabled}
                    data-testid={`checkbox-quick-product-${product.id}`}
                  />
                  <Label
                    htmlFor={`quick-${product.id}`}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      ${product.price}
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-quick-products">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-quick-products">
            <Star className="w-4 h-4 mr-2" />
            Save Quick Products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
