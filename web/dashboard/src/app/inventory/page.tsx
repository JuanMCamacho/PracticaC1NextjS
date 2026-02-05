'use client';

import { useEffect, useState } from 'react';

interface InventoryItem {
  product_id: number;
  product_name: string;
  unidades_salidas: number;
  stock_actual: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
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
        <div className="text-2xl text-[#8B4789]">Cargando inventario...</div>
      </div>
    );
  }

  const lowStockItems = inventory.filter((item) => item.stock_actual < 10);
  const mediumStockItems = inventory.filter(
    (item) => item.stock_actual >= 10 && item.stock_actual < 50
  );
  const highStockItems = inventory.filter((item) => item.stock_actual >= 50);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">📋 Inventario</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FF6B6B]">
          <div className="text-sm text-gray-600">Stock Bajo (&lt;10)</div>
          <div className="text-3xl font-bold text-[#FF6B6B]">
            {lowStockItems.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FFA726]">
          <div className="text-sm text-gray-600">Stock Medio (10-50)</div>
          <div className="text-3xl font-bold text-[#FFA726]">
            {mediumStockItems.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#7CB342]">
          <div className="text-sm text-gray-600">Stock Alto (&gt;50)</div>
          <div className="text-3xl font-bold text-[#7CB342]">
            {highStockItems.length}
          </div>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Rotación de Inventario</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Unidades Salidas</th>
                <th className="px-4 py-2 text-right">Stock Actual</th>
                <th className="px-4 py-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                let statusColor = 'bg-[#7CB342] text-white';
                let statusText = 'Buen Stock';
                
                if (item.stock_actual < 10) {
                  statusColor = 'bg-[#FF6B6B] text-white';
                  statusText = '¡Crítico!';
                } else if (item.stock_actual < 50) {
                  statusColor = 'bg-[#FFA726] text-white';
                  statusText = 'Bajo';
                }

                return (
                  <tr key={item.product_id} className="border-b hover:bg-[#F5E6F1]">
                    <td className="px-4 py-2">{item.product_id}</td>
                    <td className="px-4 py-2 font-medium">{item.product_name}</td>
                    <td className="px-4 py-2 text-right">{item.unidades_salidas}</td>
                    <td className="px-4 py-2 text-right">
                      <span
                        className={`font-bold ${
                          item.stock_actual < 10
                            ? 'text-[#FF6B6B]'
                            : item.stock_actual < 50
                            ? 'text-[#FFA726]'
                            : 'text-[#7CB342]'
                        }`}
                      >
                        {item.stock_actual}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos Críticos */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">
            ⚠️ Atención: {lowStockItems.length} productos con stock crítico
          </h3>
          <p className="text-gray-700">
            Se recomienda reabastecer estos productos lo antes posible.
          </p>
        </div>
      )}
    </div>
  );
}
