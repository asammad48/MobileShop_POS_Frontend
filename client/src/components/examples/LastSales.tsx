import LastSales from '../LastSales';

export default function LastSalesExample() {
  return (
    <div className="p-6">
      <LastSales onViewAll={() => console.log('View all sales clicked')} />
    </div>
  );
}
