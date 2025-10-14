import ProductSearch from '../ProductSearch';

export default function ProductSearchExample() {
  const products = [
    { id: '1', name: 'iPhone 13 Screen', barcode: '123456789', price: '89.99', stock: 12, lowStockThreshold: 5 },
    { id: '2', name: 'Samsung S21 Battery', barcode: '987654321', price: '45.50', stock: 3, lowStockThreshold: 5 },
    { id: '3', name: 'Phone Case Premium', barcode: '111222333', price: '15.99', stock: 25, lowStockThreshold: 5 },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <ProductSearch 
        products={products}
        onSelectProduct={(product) => console.log('Selected:', product)}
        autoFocus
      />
    </div>
  );
}
