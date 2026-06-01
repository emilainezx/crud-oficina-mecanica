import { Outlet, Link } from "react-router-dom";
import { Users, Car, Wrench, DesktopTower, IdentificationBadge, Package, ClipboardText } from "@phosphor-icons/react";

function App() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <Wrench size={32} weight="duotone" className="text-blue-400" />
          <h1 className="text-xl font-bold tracking-wider">Oficina<span className="text-blue-400">Pro</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <DesktopTower size={24} />
            <span>Dashboard</span>
          </Link>
          <Link to="/clientes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <Users size={24} />
            <span>Clientes</span>
          </Link>
          <Link to="/veiculos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <Car size={24} />
            <span>Veículos</span>
          </Link>
          <Link to="/funcionarios" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <IdentificationBadge size={24} />
            <span>Funcionários</span>
          </Link>
          <Link to="/itens" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <Package size={24} />
            <span>Peças/Serviços</span>
          </Link>
          <Link to="/ordens" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <ClipboardText size={24} />
            <span>Ordens de Serviço</span>
          </Link>
        </nav>
      </aside>

      {/* Área Central onde o conteúdo muda */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;