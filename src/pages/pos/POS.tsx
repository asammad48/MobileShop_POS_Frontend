import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProductSearch from '@/components/ProductSearch';
import CartItem from '@/components/CartItem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Check } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { Html5QrcodeScanner } from "html5-qrcode";
interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  lowStock: boolean;
}

export default function POS() {
  useAuth(['sales_person', 'admin']);
  const [cart, setCart] = useState<CartItemType[]>([]); //todo: remove mock functionality
  const [taxRate] = useState(0.1);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [result, setResult] = useState("");
  const [couponCode, setCouponeCode] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(search);
    }
  };  

  const handleAddToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({ title: 'Out of Stock', description: 'No more stock available', variant: 'destructive' });
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        stock: product.stock,
        lowStock: product.stock < product.lowStockThreshold,
      }]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast({ title: 'Empty Cart', description: 'Add items to cart first', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Sale Completed',
      description: `Total: $${total.toFixed(2)}`,
    });
    setCart([]);
    setDiscount(0);
  };

  const handleScanning = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scanner.render((decodedText, decodedResult) => {
      setResult(decodedText);
      console.log("Scanned:", decodedText);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-4">
        <div>
          <p className="text-muted-foreground">Scan or search for products</p>
        </div>

        <ProductSearch
          products={mockProducts}
          onSelectProduct={handleAddToCart}
          handleScanning={handleScanning}
          search={search}
          onKeyDown={handleKeyDown}
          setSearch={setSearch}
          result={result}
          setResult={setResult}
          autoFocus
        />

        <div>
          <div id="reader" style={{ width: "300px" }}></div>
        </div>

        <Card className="flex-1">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Current Sale</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No items in cart
              </div>
            ) : (
              cart.map(item => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium" data-testid="text-tax">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="discount" className="text-muted-foreground">Discount</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-24 text-right"
                min="0"
                step="0.01"
                data-testid="input-discount"
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="coupon" className='text-muted-foreground'>Coupon</label>
              <Input 
              type="text" 
              value={couponCode}
              className="w-24 text-right"
              />

            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold" data-testid="text-total">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              className="w-full bg-gradient-to-br from-chart-4 to-chart-3"
              size="lg"
              onClick={handleCompleteSale}
              data-testid="button-complete-sale"
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Sale
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast({ title: 'Print Receipt', description: 'Printing receipt...' })}
              data-testid="button-print-receipt"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
