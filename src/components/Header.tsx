import { Link } from 'react-router-dom';
import { Home, Image as ImageIcon, Calculator, Hammer, LayoutDashboard, FileText, Sun, Moon, Wallet, LogIn, LogOut, BarChart3, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { isDark, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-[#050505] border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Мій Дім</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              <li>
                <Link to="/staging" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  Дизайн
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <Calculator className="w-4 h-4" />
                  Оцінка
                </Link>
              </li>
              <li>
                <Link to="/renovation" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <Hammer className="w-4 h-4" />
                  Ремонт
                </Link>
              </li>
              <li>
                <Link to="/contracts" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                  Договори
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Аналітика
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Кабінет
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                    <ShieldAlert className="w-4 h-4" />
                    Адмін
                  </Link>
                </li>
              )}
            </ul>

            <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-white/10 pl-6">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-500/20">
                    <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      {profile?.balance || 0} кр.
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Вийти
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 text-sm font-medium bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Увійти
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
