'use client';

import { useEffect, useState } from 'react';

interface CustomerData {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function CustomersPage() {
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    fetch(`/api/customers/value?${params.toString()}`)
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
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#8B4789]">Cargando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#8B4789]">Valor de Clientes</h1>
        <div className="bg-[#FF6B6B] bg-opacity-10 border-l-4 border-[#FF6B6B] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-[#FF6B6B] mb-2">Error</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8B4789]">Valor de Clientes</h1>

      {/* Información de paginación */}
      {data && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">
            Mostrando {data.data.length} de {data.pagination.totalRecords} clientes
            {' '}(Página {data.pagination.page} de {data.pagination.totalPages})
          </div>
        </div>
      )}

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-right">Núm. Órdenes</th>
                <th className="px-6 py-3 text-right">Total Gastado</th>
                <th className="px-6 py-3 text-right">Gasto Promedio</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map((customer: any) => (
                <tr key={customer.customer_id} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4">{customer.customer_id}</td>
                  <td className="px-6 py-4 font-medium">{customer.customer_name}</td>
                  <td className="px-6 py-4 text-right">{customer.num_ordenes}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#7CB342]">
                    ${Number(customer.total_gastado).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    ${Number(customer.gasto_promedio).toFixed(2)}
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
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Primera
              </button>
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
              <button
                onClick={() => setPage(data.pagination.totalPages)}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Última
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
