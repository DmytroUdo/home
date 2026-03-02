import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingTable() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Plan */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Безкоштовний</h3>
          <p className="text-gray-400 text-sm">Для ознайомлення з можливостями</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">0</span>
            <span className="text-gray-400">грн/міс</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>1 стейджинг на місяць</span>
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>1 оцінка на місяць</span>
          </li>
          <li className="flex items-center gap-3 text-gray-500">
            <XCircle className="w-5 h-5 text-red-400/50" />
            <span>Кошторис ремонту</span>
          </li>
          <li className="flex items-center gap-3 text-gray-500">
            <XCircle className="w-5 h-5 text-red-400/50" />
            <span>Без водяних знаків</span>
          </li>
        </ul>
        <Link to="/dashboard" className="w-full py-4 rounded-xl font-bold text-center bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
          Почати безкоштовно
        </Link>
      </div>

      {/* Premium Plan */}
      <div className="bg-gradient-to-b from-purple-900/20 to-[#050505] p-8 rounded-3xl border-2 border-purple-500 relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-purple-500/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
          Популярний
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Преміум</h3>
          <p className="text-gray-400 text-sm">Для активних користувачів</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">199</span>
            <span className="text-gray-400">грн/міс</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-white">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>Безлімітний стейджинг</span>
          </li>
          <li className="flex items-center gap-3 text-white">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>Безлімітна оцінка</span>
          </li>
          <li className="flex items-center gap-3 text-white">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>Безлімітні кошториси</span>
          </li>
          <li className="flex items-center gap-3 text-white">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>Без водяних знаків (HD)</span>
          </li>
        </ul>
        <button className="w-full py-4 rounded-xl font-bold text-center bg-purple-600 hover:bg-purple-500 text-white transition-colors">
          Оформити підписку
        </button>
      </div>

      {/* Business Plan */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Бізнес</h3>
          <p className="text-gray-400 text-sm">Для агентств нерухомості</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">999</span>
            <span className="text-gray-400">грн/міс</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>Все з Преміум</span>
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>Доступ для 5 учасників</span>
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>Брендування матеріалів</span>
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span>Пріоритетна підтримка</span>
          </li>
        </ul>
        <button className="w-full py-4 rounded-xl font-bold text-center bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
          Зв'язатися з нами
        </button>
      </div>
    </div>
  );
}
