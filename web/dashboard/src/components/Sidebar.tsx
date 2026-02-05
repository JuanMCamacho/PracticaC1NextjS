'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '' },
  { href: '/sales', label: 'Ventas', icon: '' },
  { href: '/products', label: 'Productos', icon: '' },
  { href: '/inventory', label: 'Inventario', icon: '' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#E84B8A] min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#8B4789] text-white shadow-lg'
                  : 'text-white hover:bg-[#d63d75]'
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
