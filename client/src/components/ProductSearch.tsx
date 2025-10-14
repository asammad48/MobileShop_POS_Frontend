import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Barcode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: string;
  stock: number;
  lowStockThreshold: number;
}

interface ProductSearchProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  autoFocus?: boolean;
}

export default function ProductSearch({ products, onSelectProduct, autoFocus = false }: ProductSearchProps) {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (search.trim()) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.includes(search)
      );
      setFilteredProducts(filtered);
      setShowResults(true);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
  }, [search, products]);

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setSearch('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
          autoFocus={autoFocus}
          data-testid="input-product-search"
        />
        <Barcode className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      
      {showResults && filteredProducts.length > 0 && (
        <Card className="absolute z-10 w-full mt-2 max-h-80 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full p-3 text-left hover-elevate active-elevate-2 flex items-center justify-between border-b last:border-b-0"
              data-testid={`button-select-product-${product.id}`}
            >
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {product.barcode && `Barcode: ${product.barcode}`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${product.price}</div>
                {product.stock < product.lowStockThreshold && (
                  <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                )}
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
