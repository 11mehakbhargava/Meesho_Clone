import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';

export default function RecentOrdersCard({ orders = [], onNavigateTab, formatCurrency }) {
  return (
    <Card className="lg:col-span-2 border border-gray-100 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#b7004d]" />
            Recent Orders
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Latest transactions processed in the system</p>
        </div>
        {onNavigateTab && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#b7004d] hover:bg-pink-50 font-semibold"
          >
            All Orders <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">
                      #{order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 text-xs">
                        {order.user?.fullName || 'Customer'}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                        {order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 text-xs">
                      {formatCurrency ? formatCurrency(order.totalAmount) : `₹${order.totalAmount}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        order.paymentStatus === 'PAID' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No orders recorded in the database yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
