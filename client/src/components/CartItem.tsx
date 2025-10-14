import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  lowStock?: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ 
  id, 
  name, 
  price, 
  quantity, 
  stock, 
  lowStock,
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) {
  const total = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border-b" data-testid={`cart-item-${id}`}>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {name}
          {lowStock && <Badge variant="destructive" className="text-xs">Low Stock</Badge>}
        </div>
        <div className="text-sm text-muted-foreground">${price.toFixed(2)} each</div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          data-testid={`button-decrease-${id}`}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          className="w-16 text-center"
          min="1"
          max={stock}
          data-testid={`input-quantity-${id}`}
        />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= stock}
          data-testid={`button-increase-${id}`}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="font-semibold min-w-20 text-right" data-testid={`text-total-${id}`}>
        ${total.toFixed(2)}
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRemove(id)}
        data-testid={`button-remove-${id}`}
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}
