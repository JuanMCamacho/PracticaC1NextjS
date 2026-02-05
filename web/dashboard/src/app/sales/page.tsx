'use client';

import { useEffect, useState } from 'react';

interface SalesData {
  salesDaily: any[];
  customerValue: any[];
  profitability: any[];
}

export default function SalesPage() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sales')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#8B4789]">Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">📊 Ventas</h1>

      {/* Ventas Diarias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Ventas Diarias (Últimos 30 días)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-right">Total Ventas</th>
                <th className="px-4 py-2 text-right">Tickets</th>
                <th className="px-4 py-2 text-right">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data?.salesDaily.map((sale, idx) => (
                <tr key={idx} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right font-bold text-[#7CB342]">
                    ${Number(sale.total_ventas).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">{sale.tickets}</td>
                  <td className="px-4 py-2 text-right">
                    ${Number(sale.ticket_promedio).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valor del Cliente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Top 20 Clientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-right">Órdenes</th>
                <th className="px-4 py-2 text-right">Total Gastado</th>
                <th className="px-4 py-2 text-right">Gasto Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data?.customerValue.map((customer, idx) => (
                <tr key={idx} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2 font-medium">{customer.customer_name}</td>
                  <td className="px-4 py-2 text-right">{customer.num_ordenes}</td>
                  <td className="px-4 py-2 text-right font-bold text-[#8B4789]">
                    ${Number(customer.total_gastado).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${Number(customer.gasto_promedio).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rentabilidad por Producto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Rentabilidad por Producto</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Revenue</th>
                <th className="px-4 py-2 text-right">Costo</th>
                <th className="px-4 py-2 text-right">Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {data?.profitability.map((product, idx) => (
                <tr key={idx} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2 font-medium">{product.product_name}</td>
                  <td className="px-4 py-2 text-right">${Number(product.revenue).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-[#FF6B6B]">
                    ${Number(product.total_cost).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-[#7CB342]">
                    ${Number(product.profit).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
