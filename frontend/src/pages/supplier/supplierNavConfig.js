import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  RotateCcw,
  PlusCircle,
  Store,
  ShieldCheck,
  Banknote,
  LineChart,
} from 'lucide-react';

export const SUPPLIER_MENU = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Products & Catalog', icon: Package },
  { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingCart },
  { id: 'finance', label: 'Settlements & Payouts 💳', icon: Banknote },
  { id: 'dropship', label: 'Dropship Fulfilment 📦', icon: Truck },
  { id: 'returns', label: 'Returns & RTO Hub 🔄', icon: RotateCcw },
  { id: 'add-product', label: 'Add New Product ➕', icon: PlusCircle },
  { id: 'kyc', label: 'Supplier KYC Hub 🛡️', icon: ShieldCheck },
  { id: 'analytics', label: 'Sales Analytics 📊', icon: LineChart },
  { id: 'profile', label: 'Store Profile & Bank', icon: Store },
];

