import CartItem from '../CartItem';
import { useState } from 'react';

export default function CartItemExample() {
  const [quantity, setQuantity] = useState(2);

  return (
    <div className="p-6 max-w-2xl">
      <CartItem 
        id="1"
        name="iPhone 13 Screen"
        price={89.99}
        quantity={quantity}
        stock={12}
        lowStock={false}
        onUpdateQuantity={(_, qty) => setQuantity(qty)}
        onRemove={() => console.log('Remove item')}
      />
      <CartItem 
        id="2"
        name="Samsung S21 Battery"
        price={45.50}
        quantity={1}
        stock={3}
        lowStock={true}
        onUpdateQuantity={(_, qty) => console.log('Update qty:', qty)}
        onRemove={() => console.log('Remove item')}
      />
    </div>
  );
}
