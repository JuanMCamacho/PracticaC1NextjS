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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sales')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
      })
      .then((response) => {
        if (!response.success) {
          setError(response.error?.message || 'Error desconocido');
        } else {
          setData(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('No se pudo conectar a la base de datos.');
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

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#8B4789]">Ventas</h1>
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">Error</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">Ventas y Análisis</h1>

      {/* Ventas Diarias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Ventas Diarias</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-right">Total Ventas</th>
                <th className="px-6 py-3 text-right">Órdenes</th>
                <th className="px-6 py-3 text-right">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {(data?.salesDaily || []).slice(0, 10).map((sale: any, index: number) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4">{new Date(sale.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#7CB342]">
                    ${Number(sale.total_ventas).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">{sale.total_ordenes}</td>
                  <td className="px-6 py-4 text-right">
                    ${Number(sale.ticket_promedio).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valor por Cliente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Top Clientes por Valor</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-right">Total Compras</th>
                <th className="px-6 py-3 text-right">Órdenes</th>
                <th className="px-6 py-3 text-right">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {(data?.customerValue || []).slice(0, 10).map((customer: any, index: number) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4 font-medium">{customer.cliente}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#7CB342]">
                    ${Number(customer.total_compras).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">{customer.total_ordenes}</td>
                  <td className="px-6 py-4 text-right">
                    ${Number(customer.ticket_promedio).toFixed(2)}
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
            <thead className="bg-[#7CB342] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-right">Unidades</th>
                <th className="px-6 py-3 text-right">Ingresos</th>
                <th className="px-6 py-3 text-right">Costos</th>
                <th className="px-6 py-3 text-right">Ganancia</th>
                <th className="px-6 py-3 text-right">Margen %</th>
              </tr>
            </thead>
            <tbody>
              {(data?.profitability || []).map((product: any, index: number) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4 font-medium">{product.nombre_producto}</td>
                  <td className="px-6 py-4 text-right">{product.unidades_vendidas}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#7CB342]">
                    ${Number(product.ingresos_totales).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-[#FF6B6B]">
                    ${Number(product.costos_totales).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    ${Number(product.ganancia_neta).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {Number(product.margen_porcentaje).toFixed(1)}%
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