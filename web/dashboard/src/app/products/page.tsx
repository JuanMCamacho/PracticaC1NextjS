'use client';

import { useEffect, useState } from 'react';

interface ProductData {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search: string;
  };
}

export default function ProductsPage() {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    fetch(`/api/products/top?${params.toString()}`)
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
  }, [page, search]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#8B4789]">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#8B4789]">Top Productos</h1>
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">Error</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">Top Productos</h1>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-[#8B4789] mb-4">Búsqueda</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por nombre de producto..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E84B8A]"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#E84B8A] text-white rounded-md hover:bg-[#8B4789] transition-colors"
          >
            Buscar
          </button>
          <button
            onClick={handleClearSearch}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Limpiar
          </button>
        </div>
        {data && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {data.data.length} de {data.pagination.totalRecords} productos
            {data.filters.search && ` - Búsqueda: "${data.filters.search}"`}
          </div>
        )}
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Ranking</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Unidades Vendidas</th>
                <th className="px-4 py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map((product: any) => (
                <tr key={product.product_id} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E84B8A] text-white font-bold">
                      {product.ranking}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium">{product.product_name}</td>
                  <td className="px-4 py-2 text-right">{product.unidades_vendidas}</td>
                  <td className="px-4 py-2 text-right font-bold text-[#7CB342]">
                    ${Number(product.revenue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {data && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data.pagination.hasPrevPage}
                className="px-4 py-2 bg-[#E84B8A] text-white rounded-md hover:bg-[#8B4789] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.pagination.hasNextPage}
                className="px-4 py-2 bg-[#E84B8A] text-white rounded-md hover:bg-[#8B4789] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
