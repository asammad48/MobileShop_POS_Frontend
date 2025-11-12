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
import { Input } from '@/components/ui/input';
import { Settings, Star, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedIds);
      setSearchQuery('');
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-quick-products"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isAtLimit ? 'destructive' : 'secondary'}>
              {localSelection.length}/{maxSelections} {isAtLimit && '(Max reached)'}
            </Badge>
            {searchQuery && (
              <Badge variant="outline">
                {filteredProducts.length} results
              </Badge>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => {
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
          )}
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
