import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#8B4789] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">AWOS Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Sistema de Gestión</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
