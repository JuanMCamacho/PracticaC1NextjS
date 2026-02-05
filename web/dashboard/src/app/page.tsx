'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  todaySales: number;
  todayOrders: number;
  lowStock: number;
  salesDaily: any[];
  topProducts: any[];
  inventoryRisk: any[];
  paymentMix: any[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
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
        setError('No se pudo conectar a la base de datos. Verifica que Docker esté corriendo.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#8B4789]">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#8B4789]">Dashboard Principal</h1>
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">Error de Conexión</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Ejecuta: <code className="bg-gray-200 px-2 py-1 rounded">docker-compose up db -d</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">Dashboard Principal</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E84B8A]">
          <div className="text-sm text-gray-600">Ventas Hoy</div>
          <div className="text-3xl font-bold text-[#8B4789]">
            ${Number(data?.todaySales || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#7CB342]">
          <div className="text-sm text-gray-600">Órdenes Hoy</div>
          <div className="text-3xl font-bold text-[#7CB342]">
            {data?.todayOrders || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FF6B6B]">
          <div className="text-sm text-gray-600">Stock Bajo</div>
          <div className="text-3xl font-bold text-[#FF6B6B]">
            {data?.lowStock || 0}
          </div>
        </div>
      </div>

      {/* Top Productos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Top 10 Productos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Ranking</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Unidades</th>
                <th className="px-4 py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topProducts || []).slice(0, 10).map((product, idx) => (
                <tr key={idx} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2">{product.ranking}</td>
                  <td className="px-4 py-2 font-medium">{product.product_name}</td>
                  <td className="px-4 py-2 text-right">{product.unidades_vendidas}</td>
                  <td className="px-4 py-2 text-right">${Number(product.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riesgo de Inventario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Riesgo de Inventario</h2>
        <div className="space-y-3">
          {(data?.inventoryRisk || []).map((category, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#F5E6F1] rounded">
              <div>
                <div className="font-medium text-[#8B4789]">{category.category_name}</div>
                <div className="text-sm text-gray-600">
                  {category.productos_en_riesgo} de {category.productos_totales} productos
                </div>
              </div>
              <div className="text-2xl font-bold text-[#E84B8A]">
                {Number(category.porcentaje_riesgo).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mezcla de Pagos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Métodos de Pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.paymentMix || []).map((payment, idx) => (
            <div key={idx} className="p-4 bg-[#F5E6F1] rounded-lg">
              <div className="text-sm text-gray-600">{payment.method}</div>
              <div className="text-2xl font-bold text-[#8B4789]">
                ${Number(payment.total_pagado).toFixed(2)}
              </div>
              <div className="text-sm text-[#E84B8A]">
                {Number(payment.porcentaje).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
