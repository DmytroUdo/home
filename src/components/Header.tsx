import { Link } from 'react-router-dom';
import { Home, Image as ImageIcon, Calculator, Hammer, LayoutDashboard } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[#050505] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-purple-500" />
              <span className="font-bold text-xl tracking-tight text-white">Мій Дім</span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link to="/staging" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  Дизайн
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <Calculator className="w-4 h-4" />
                  Оцінка
                </Link>
              </li>
              <li>
                <Link to="/renovation" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <Hammer className="w-4 h-4" />
                  Ремонт
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Кабінет
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
