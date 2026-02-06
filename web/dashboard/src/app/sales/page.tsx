'use client';

import { useEffect, useState } from 'react';

interface SalesData {
  data: any[];
  filters: {
    date_from: string | null;
    date_to: string | null;
  };
  count: number;
}

export default function SalesPage() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);

    fetch(`/api/sales/daily?${params.toString()}`)
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

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setTimeout(() => fetchData(), 100);
  };

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
      <h1 className="text-3xl font-bold text-[#8B4789]">Ventas Diarias</h1>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-[#8B4789] mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E84B8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E84B8A]"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-[#E84B8A] text-white rounded-md hover:bg-[#8B4789] transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        {data && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {data.count} registros
            {data.filters.date_from && ` desde ${data.filters.date_from}`}
            {data.filters.date_to && ` hasta ${data.filters.date_to}`}
          </div>
        )}
      </div>

      {/* Ventas Diarias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#8B4789] mb-4">Resultados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-right">Total Ventas</th>
                <th className="px-6 py-3 text-right">Tickets</th>
                <th className="px-6 py-3 text-right">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data || []).map((sale: any, index: number) => (
                <tr key={index} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-6 py-4">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#7CB342]">
                    ${Number(sale.total_ventas).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">{sale.tickets}</td>
                  <td className="px-6 py-4 text-right">
                    ${Number(sale.ticket_promedio).toFixed(2)}
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