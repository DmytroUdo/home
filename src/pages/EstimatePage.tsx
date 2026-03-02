import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export default function EstimatePage() {
  const [formData, setFormData] = useState({
    city: 'Київ',
    district: '',
    area: '',
    floor: '',
    total_floors: '',
    condition: 'З ремонтом',
    year: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "" });
      
      const prompt = `You are a Ukrainian real estate expert with deep knowledge of property market in 2024-2025. 

Apartment details:
- City: ${formData.city}
- District: ${formData.district}
- Area: ${formData.area} m²
- Floor: ${formData.floor} of ${formData.total_floors}
- Condition: ${formData.condition}
- Year built: ${formData.year}

Return ONLY valid JSON, no markdown, no explanation:
{
  "sale_price_min": number in UAH,
  "sale_price_max": number in UAH,
  "rental_price_min": number in UAH per month,
  "rental_price_max": number in UAH per month,
  "price_per_sqm": number in UAH,
  "market_trend": "sell_now" or "wait" or "neutral",
  "trend_reason": string 2 sentences in Ukrainian,
  "confidence": "high" or "medium" or "low"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sale_price_min: { type: Type.NUMBER },
              sale_price_max: { type: Type.NUMBER },
              rental_price_min: { type: Type.NUMBER },
              rental_price_max: { type: Type.NUMBER },
              price_per_sqm: { type: Type.NUMBER },
              market_trend: { type: Type.STRING },
              trend_reason: { type: Type.STRING },
              confidence: { type: Type.STRING }
            },
            required: ["sale_price_min", "sale_price_max", "rental_price_min", "rental_price_max", "price_per_sqm", "market_trend", "trend_reason", "confidence"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      // Save to backend
      fetch('/api/save-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_data: formData, result: data })
      }).catch(console.error);

      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Помилка оцінки. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Оцінка вартості нерухомості</h1>
        <p className="text-gray-400 text-lg">Дізнайтеся ринкову вартість продажу та оренди вашої квартири</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Місто</label>
                <select 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="Київ">Київ</option>
                  <option value="Львів">Львів</option>
                  <option value="Одеса">Одеса</option>
                  <option value="Дніпро">Дніпро</option>
                  <option value="Харків">Харків</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Район</label>
                <input 
                  type="text" 
                  name="district" 
                  required
                  value={formData.district} 
                  onChange={handleChange}
                  placeholder="Наприклад: Печерський"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Площа (м²)</label>
                  <input 
                    type="number" 
                    name="area" 
                    required
                    min="10"
                    value={formData.area} 
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Рік побудови</label>
                  <input 
                    type="number" 
                    name="year" 
                    required
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.year} 
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Поверх</label>
                  <input 
                    type="number" 
                    name="floor" 
                    required
                    min="1"
                    value={formData.floor} 
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Поверховість</label>
                  <input 
                    type="number" 
                    name="total_floors" 
                    required
                    min="1"
                    value={formData.total_floors} 
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Стан</label>
                <select 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="Без ремонту">Без ремонту</option>
                  <option value="Житловий стан">Житловий стан</option>
                  <option value="З ремонтом">З ремонтом</option>
                  <option value="Євроремонт">Євроремонт</option>
                  <option value="Дизайнерський ремонт">Дизайнерський ремонт</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Оцінюємо...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Оцінити вартість
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col justify-center relative overflow-hidden">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative z-10">
              <div className="space-y-2">
                <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Вартість продажу</h3>
                <div className="text-4xl font-bold text-white">
                  {result.sale_price_min?.toLocaleString('uk-UA')} - {result.sale_price_max?.toLocaleString('uk-UA')} <span className="text-xl text-gray-400 font-normal">₴</span>
                </div>
                <p className="text-[#00FF88] text-sm font-medium">~{result.price_per_sqm?.toLocaleString('uk-UA')} ₴ / м²</p>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="space-y-2">
                <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Вартість оренди</h3>
                <div className="text-3xl font-bold text-white">
                  {result.rental_price_min?.toLocaleString('uk-UA')} - {result.rental_price_max?.toLocaleString('uk-UA')} <span className="text-xl text-gray-400 font-normal">₴ / міс</span>
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Тренд ринку</span>
                  <div className="flex items-center gap-1">
                    {result.market_trend === 'sell_now' && <TrendingUp className="w-4 h-4 text-[#00FF88]" />}
                    {result.market_trend === 'wait' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {result.market_trend === 'neutral' && <Minus className="w-4 h-4 text-purple-400" />}
                    <span className={`text-sm font-bold ${
                      result.market_trend === 'sell_now' ? 'text-[#00FF88]' : 
                      result.market_trend === 'wait' ? 'text-red-400' : 'text-purple-400'
                    }`}>
                      {result.market_trend === 'sell_now' ? 'Продавати зараз' : 
                       result.market_trend === 'wait' ? 'Зачекати' : 'Нейтральний'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {result.trend_reason}
                </p>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Точність оцінки: <span className="font-medium text-gray-400 capitalize">{result.confidence === 'high' ? 'Висока' : result.confidence === 'medium' ? 'Середня' : 'Низька'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-50">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-white">Заповніть форму для отримання оцінки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
