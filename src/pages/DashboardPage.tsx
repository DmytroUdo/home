import { CreditCard, Image as ImageIcon, Calculator, Hammer } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Особистий кабінет</h1>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-colors">
          Оновити план
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Credits */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm">Поточний план</h3>
              <div className="text-2xl font-bold text-white">Безкоштовний</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Стейджинг</span>
                <span className="text-white font-medium">1 / 1</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-[#00FF88] h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Оцінка</span>
                <span className="text-white font-medium">1 / 1</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-[#00FF88] h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Кошторис</span>
                <span className="text-white font-medium">0 / 0</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/5">
          <h3 className="text-2xl font-bold text-white mb-6">Остання активність</h3>
          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Стейджинг вітальні</h4>
                  <p className="text-sm text-gray-400">Сьогодні, 14:30</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">Готово</span>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Оцінка квартири (Київ, Печерськ)</h4>
                  <p className="text-sm text-gray-400">Вчора, 10:15</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">Готово</span>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Кошторис ремонту</h4>
                  <p className="text-sm text-gray-400">Недоступно на вашому плані</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold">Заблоковано</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
