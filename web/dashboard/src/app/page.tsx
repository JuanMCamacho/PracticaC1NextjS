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

  useEffect(() => {
    fetch('/api/dashboard')
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
        <div className="text-2xl text-[#8B4789]">Cargando...</div>
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
              {data?.topProducts.slice(0, 10).map((product, idx) => (
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
          {data?.inventoryRisk.map((category, idx) => (
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
          {data?.paymentMix.map((payment, idx) => (
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
