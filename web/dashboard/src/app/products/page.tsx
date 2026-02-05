'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  category_name: string;
  supplier_name: string;
  price: number;
  stock: number;
  active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
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
        <div className="text-2xl text-[#8B4789]">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#8B4789]">📦 Productos</h1>
        <div className="text-sm text-gray-600">
          Total: {products.length} productos
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E84B8A] text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-right">Stock</th>
                <th className="px-4 py-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-[#F5E6F1]">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2 font-medium">{product.name}</td>
                  <td className="px-4 py-2">{product.category_name || '-'}</td>
                  <td className="px-4 py-2">{product.supplier_name || '-'}</td>
                  <td className="px-4 py-2 text-right font-bold text-[#8B4789]">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span
                      className={`font-bold ${
                        product.stock < 10
                          ? 'text-[#FF6B6B]'
                          : product.stock < 50
                          ? 'text-[#FFA726]'
                          : 'text-[#7CB342]'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-[#7CB342] text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
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
