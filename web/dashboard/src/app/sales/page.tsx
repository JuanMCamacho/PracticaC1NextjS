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
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setData(data);
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
      <h1 className="text-3xl font-bold text-[#8B4789]">Dashboard AWOS</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Ventas</h3>
          <p className="text-3xl font-bold text-[#7CB342]">
            ${data?.metrics.totalSales.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Productos</h3>
          <p className="text-3xl font-bold text-[#8B4789]">
            {data?.metrics.totalProducts || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Productos Bajo Stock</h3>
          <p className="text-3xl font-bold text-[#FF6B6B]">
            {data?.metrics.lowStockProducts || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Clientes Activos</h3>
          <p className="text-3xl font-bold text-[#E84B8A]">
            {data?.metrics.activeCustomers || 0}
          </p>
        </div>
      </div>

      {/* Top 5 Productos Más Vendidos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Top 5 Productos Más Vendidos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-right">Cantidad Vendida</th>
                <th className="px-6 py-3 text-right">Total Ventas</th>
              </tr>
            </thead>
            <tbody>
              {data?.topProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4">{product.nombre_producto}</td>
                  <td className="px-6 py-4">{product.categoria}</td>
                  <td className="px-6 py-4 text-right">{product.cantidad_vendida}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[#7CB342]">
                    ${parseFloat(product.total_ventas).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos en Riesgo de Inventario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Productos en Riesgo de Inventario</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#FF6B6B] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-right">Stock Actual</th>
                <th className="px-6 py-3 text-right">Punto de Reorden</th>
              </tr>
            </thead>
            <tbody>
              {data?.inventoryRisk.map((product, index) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4">{product.nombre_producto}</td>
                  <td className="px-6 py-4">{product.categoria}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#FF6B6B]">
                    {product.stock_actual}
                  </td>
                  <td className="px-6 py-4 text-right">{product.punto_reorden}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Métodos de Pago más Usados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Métodos de Pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.paymentMethods.map((method, index) => (
            <div key={index} className="border border-[#E84B8A] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#8B4789]">{method.metodo_pago}</h3>
              <p className="text-2xl font-bold text-[#7CB342] mt-2">
                ${parseFloat(method.total_ventas).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {method.total_transacciones} transacciones
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}