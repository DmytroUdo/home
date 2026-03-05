import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Home, Building, TrendingUp, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface AnalyticsData {
  averagePrice: number;
  pricePerSqm: number;
  totalListingsAnalyzed: number;
  marketTrend: 'up' | 'down' | 'stable';
  districts: { name: string; avgPrice: number }[];
  priceHistory: { month: string; price: number }[];
  sources: { name: string; count: number }[];
  summary: string;
}

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  const [city, setCity] = useState('Київ');
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house'>('apartment');
  const [rooms, setRooms] = useState('1');
  const [dateRange, setDateRange] = useState('last_6_months');
  const [year, setYear] = useState('all');
  const [transactionStatus, setTransactionStatus] = useState('completed');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const yearText = year === 'all' ? 'Всі роки' : `Рік побудови: ${year}`;
      // Mock response for "без апі роби"
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockData: AnalyticsData = {
        averagePrice: type === 'rent' ? 15000 : 50000,
        pricePerSqm: type === 'rent' ? 300 : 1200,
        totalListingsAnalyzed: 1240,
        marketTrend: 'stable',
        districts: [
          { name: 'Центральний', avgPrice: type === 'rent' ? 20000 : 70000 },
          { name: 'Спальний', avgPrice: type === 'rent' ? 12000 : 40000 },
          { name: 'Передмістя', avgPrice: type === 'rent' ? 10000 : 35000 }
        ],
        priceHistory: [
          { month: 'Січ', price: type === 'rent' ? 14500 : 48000 },
          { month: 'Лют', price: type === 'rent' ? 14800 : 49000 },
          { month: 'Бер', price: type === 'rent' ? 15000 : 50000 }
        ],
        sources: [
          { name: 'OLX', count: 850 },
          { name: 'DOM.RIA', count: 390 }
        ],
        summary: `Ринок нерухомості в місті ${city} демонструє стабільність. Середня ціна ${type === 'rent' ? 'оренди' : 'продажу'} для ${propertyType === 'apartment' ? 'квартир' : 'будинків'} (${rooms} кімн.) становить ${type === 'rent' ? '15000 грн/міс' : '50000$'} ${yearText !== 'Всі роки' ? `(${yearText})` : ''}.`
      };
      
      setData(mockData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Сталася помилка під час аналізу даних.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Аналітика нерухомості</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Аналіз цін на оренду та купівлю на основі даних OLX та DOM.RIA
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Місто</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                placeholder="Наприклад, Київ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Операція</label>
            <div className="flex bg-gray-50 dark:bg-[#1A1A1A] p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setType('rent')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  type === 'rent'
                    ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Оренда
              </button>
              <button
                onClick={() => setType('buy')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  type === 'buy'
                    ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Купівля
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Тип об'єкту</label>
            <div className="flex bg-gray-50 dark:bg-[#1A1A1A] p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setPropertyType('apartment')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  propertyType === 'apartment'
                    ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                Квартира
              </button>
              <button
                onClick={() => setPropertyType('house')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  propertyType === 'house'
                    ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                Будинок
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Кімнат</label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white appearance-none"
            >
              <option value="1">1 кімната</option>
              <option value="2">2 кімнати</option>
              <option value="3">3 кімнати</option>
              <option value="4+">4+ кімнат</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Період аналізу</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white appearance-none"
            >
              <option value="last_month">Останній місяць</option>
              <option value="last_3_months">Останні 3 місяці</option>
              <option value="last_6_months">Останні 6 місяців</option>
              <option value="last_year">Останній рік</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Рік побудови</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white appearance-none"
            >
              <option value="all">Всі роки</option>
              <option value="after_2020">Після 2020</option>
              <option value="2010_2020">2010 - 2020</option>
              <option value="2000_2010">2000 - 2010</option>
              <option value="before_2000">До 2000</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Статус транзакції</label>
            <select
              value={transactionStatus}
              onChange={(e) => setTransactionStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white appearance-none"
            >
              <option value="all">Всі</option>
              <option value="pending">В обробці (Pending)</option>
              <option value="completed">Завершені (Completed)</option>
              <option value="failed">Відхилені (Failed)</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !city.trim()}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Аналізуємо...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Знайти
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Середня ціна</h3>
              </div>
              <p className="text-2xl font-bold dark:text-white">
                {data.averagePrice.toLocaleString()} {type === 'rent' ? 'грн/міс' : '$'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ціна за м²</h3>
              </div>
              <p className="text-2xl font-bold dark:text-white">
                {data.pricePerSqm.toLocaleString()} $
              </p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Тенденція</h3>
              </div>
              <p className="text-2xl font-bold dark:text-white flex items-center gap-2">
                {data.marketTrend === 'up' && <span className="text-red-500">Зростає ↗</span>}
                {data.marketTrend === 'down' && <span className="text-green-500">Падає ↘</span>}
                {data.marketTrend === 'stable' && <span className="text-blue-500">Стабільна →</span>}
              </p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Оголошень</h3>
              </div>
              <p className="text-2xl font-bold dark:text-white">
                ~{data.totalListingsAnalyzed.toLocaleString()}
              </p>
              <div className="flex gap-2 mt-2 text-xs text-gray-500">
                {data.sources.map((s, i) => (
                  <span key={i}>{s.name}: {s.count}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Висновок аналітика</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold mb-6 dark:text-white">Ціни по районах</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.districts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} horizontal={false} />
                    <XAxis type="number" stroke={isDark ? '#888' : '#666'} />
                    <YAxis dataKey="name" type="category" stroke={isDark ? '#888' : '#666'} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDark ? '#1A1A1A' : '#fff', borderColor: isDark ? '#333' : '#eee', color: isDark ? '#fff' : '#000' }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} ${type === 'rent' ? 'грн' : '$'}`, 'Ціна']}
                    />
                    <Bar dataKey="avgPrice" fill="#9333ea" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold mb-6 dark:text-white">Динаміка цін (6 міс)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} vertical={false} />
                    <XAxis dataKey="month" stroke={isDark ? '#888' : '#666'} />
                    <YAxis stroke={isDark ? '#888' : '#666'} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDark ? '#1A1A1A' : '#fff', borderColor: isDark ? '#333' : '#eee', color: isDark ? '#fff' : '#000' }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} ${type === 'rent' ? 'грн' : '$'}`, 'Ціна']}
                    />
                    <Line type="monotone" dataKey="price" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: '#9333ea', strokeWidth: 2, stroke: isDark ? '#111' : '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
