'use client';

import { useEffect, useState } from 'react';

interface InventoryData {
  data: any[];
  filters: {
    category: string | null;
    category_id: string | null;
  };
  validCategories: string[];
  count: number;
}

export default function InventoryPage() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);

    fetch(`/api/inventory/risk?${params.toString()}`)
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    fetchData();
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    setTimeout(() => fetchData(), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#8B4789]">Cargando inventario...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#8B4789]">Riesgo de Inventario</h1>
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">Error</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">Riesgo de Inventario</h1>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-[#8B4789] mb-4">Filtros por Categoría</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E84B8A]"
            >
              <option value="">Todas las categorías</option>
              {data?.validCategories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="px-6 py-2 bg-[#E84B8A] text-white rounded-md hover:bg-[#8B4789] transition-colors"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilter}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Limpiar
          </button>
        </div>
        {data && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {data.count} categorías
            {data.filters.category && ` - Filtrado por: ${data.filters.category}`}
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Resultados</h2>
        <div className="space-y-4">
          {(data?.data || []).map((category: any) => (
            <div
              key={category.category_id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-[#F5E6F1] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#8B4789]">
                    {category.category_name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Productos totales:</span> {category.productos_totales}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Productos en riesgo:</span>{' '}
                      <span className="text-[#FF6B6B] font-bold">
                        {category.productos_en_riesgo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#E84B8A]">
                    {Number(category.porcentaje_riesgo).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Riesgo</div>
                  {/* Barra de progreso */}
                  <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#E84B8A] h-2 rounded-full"
                      style={{ width: `${Math.min(100, category.porcentaje_riesgo)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

