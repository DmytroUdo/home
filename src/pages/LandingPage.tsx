import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Calculator, Hammer, CheckCircle2, FileText } from 'lucide-react';
import PricingTable from '../components/PricingTable';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI-помічник для вашого <span className="text-purple-500">житла</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Оцінюйте вартість, плануйте ремонт та створюйте дизайн інтер'єру за допомогою штучного інтелекту за лічені секунди.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link to="/staging" className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2">
            Створити дизайн <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/estimate" className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10">
            Оцінити квартиру
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <ImageIcon className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">AI Стейджинг</h3>
          <p className="text-gray-400 mb-6">Завантажте фото порожньої кімнати та отримайте 3 варіанти дизайну інтер'єру.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> 4 стилі дизайну</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Висока реалістичність</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Готово за 10 секунд</li>
          </ul>
          <Link to="/staging" className="text-purple-400 font-medium hover:underline flex items-center gap-1">Спробувати <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <Calculator className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Оцінка вартості</h3>
          <p className="text-gray-400 mb-6">Дізнайтеся ринкову вартість продажу та оренди вашої нерухомості.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Актуальні ціни 2024-2025</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Аналіз трендів ринку</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Детальний звіт</li>
          </ul>
          <Link to="/estimate" className="text-purple-400 font-medium hover:underline flex items-center gap-1">Оцінити <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <Hammer className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Кошторис ремонту</h3>
          <p className="text-gray-400 mb-6">Отримайте детальний розрахунок вартості ремонту за вашим описом.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Вартість робіт та матеріалів</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Терміни виконання</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Поради щодо економії</li>
          </ul>
          <Link to="/renovation" className="text-purple-400 font-medium hover:underline flex items-center gap-1">Розрахувати <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <FileText className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Генератор договорів</h3>
          <p className="text-gray-400 mb-6">Автоматичне створення юридично правильних договорів оренди та купівлі-продажу.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Договір оренди</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Договір купівлі-продажу</li>
            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> Готово за секунди</li>
          </ul>
          <Link to="/contracts" className="text-purple-400 font-medium hover:underline flex items-center gap-1">Створити <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Тарифи</h2>
          <p className="text-gray-400">Оберіть план, який підходить саме вам</p>
        </div>
        <PricingTable />
      </section>
    </div>
  );
}
