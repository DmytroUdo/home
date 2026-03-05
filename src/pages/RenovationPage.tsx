import React, { useState } from 'react';
import { Hammer, Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export default function RenovationPage() {
  const [formData, setFormData] = useState({
    city: 'Київ',
    area: '',
    description: ''
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const COMMON_TASKS = [
    { id: 'painting', label: 'Фарбування стін/стелі' },
    { id: 'tiling', label: 'Укладання плитки' },
    { id: 'electrical', label: 'Електромонтажні роботи' },
    { id: 'plumbing', label: 'Сантехнічні роботи' },
    { id: 'flooring', label: 'Укладання підлоги (ламінат/паркет)' },
    { id: 'demolition', label: 'Демонтажні роботи' },
    { id: 'doors', label: 'Встановлення дверей' },
    { id: 'windows', label: 'Заміна вікон' }
  ];

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "" });
      
      const selectedTaskLabels = selectedTasks
        .map(id => COMMON_TASKS.find(t => t.id === id)?.label)
        .filter(Boolean)
        .join(', ');

      const prompt = `You are a Ukrainian construction expert. Current year is 2025.

Calculate a detailed renovation quote based on:
- City: ${formData.city}
- Area: ${formData.area} m²
- Selected specific tasks: ${selectedTaskLabels || 'None specified'}
- Additional description: ${formData.description}

Return ONLY valid JSON, no markdown, no explanation:
{
  "total_min": number in UAH,
  "total_max": number in UAH,
  "timeline_weeks": number,
  "items": [
    {
      "category": string (e.g., "Демонтаж", "Електрика", "Сантехніка"),
      "work": string (e.g., "Заміна труб"),
      "materials_min": number,
      "materials_max": number,
      "labor_min": number,
      "labor_max": number,
      "where_to_buy": array of store names like Epicentr Nova Linia Leroy Merlin
    }
  ],
  "tips": array of 3 money saving tips in Ukrainian
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              total_min: { type: Type.NUMBER },
              total_max: { type: Type.NUMBER },
              timeline_weeks: { type: Type.NUMBER },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    work: { type: Type.STRING },
                    materials_min: { type: Type.NUMBER },
                    materials_max: { type: Type.NUMBER },
                    labor_min: { type: Type.NUMBER },
                    labor_max: { type: Type.NUMBER },
                    where_to_buy: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["category", "work", "materials_min", "materials_max", "labor_min", "labor_max", "where_to_buy"]
                }
              },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["total_min", "total_max", "timeline_weeks", "items", "tips"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      // Save to backend
      fetch('/api/save-renovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, result: data })
      }).catch(console.error);

      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Помилка розрахунку. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Кошторис ремонту</h1>
        <p className="text-gray-400 text-lg">Отримайте детальний розрахунок вартості ремонту за вашим описом</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white/5 p-8 rounded-3xl border border-white/5 h-fit">
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
                <label className="block text-sm font-medium text-gray-300 mb-3">Основні види робіт</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMMON_TASKS.map(task => (
                    <label 
                      key={task.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTasks.includes(task.id) 
                          ? 'bg-purple-500/20 border-purple-500/50' 
                          : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleTaskToggle(task.id)}
                          className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-md checked:border-purple-500 checked:bg-purple-500 transition-colors cursor-pointer peer"
                        />
                        <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <span className={`text-sm ${selectedTasks.includes(task.id) ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {task.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Додатковий опис (необов'язково)</label>
                <textarea 
                  name="description" 
                  rows={3}
                  value={formData.description} 
                  onChange={handleChange}
                  placeholder="Наприклад: Потрібен капітальний ремонт ванної кімнати. Заміна труб, встановлення душової кабіни та бойлера."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                />
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
                  Рахуємо...
                </>
              ) : (
                <>
                  <Hammer className="w-5 h-5" />
                  Розрахувати
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col justify-center relative overflow-hidden min-h-[500px]">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative z-10">
              
              {/* Summary */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                  <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm mb-2">Загальна вартість</h3>
                  <div className="text-3xl font-bold text-white">
                    {result.total_min?.toLocaleString('uk-UA')} - {result.total_max?.toLocaleString('uk-UA')} <span className="text-xl text-gray-400 font-normal">₴</span>
                  </div>
                </div>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm mb-1">Орієнтовний час</h3>
                    <div className="text-2xl font-bold text-white">{result.timeline_weeks} тижнів</div>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-purple-500" /> Деталізація робіт
                </h3>
                <div className="space-y-3">
                  {result.items?.map((item: any, i: number) => (
                    <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-1 rounded-md mb-2 inline-block">{item.category}</span>
                          <h4 className="text-white font-medium">{item.work}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Робота: <span className="text-white font-medium">{item.labor_min?.toLocaleString('uk-UA')} - {item.labor_max?.toLocaleString('uk-UA')} ₴</span></div>
                          <div className="text-sm text-gray-400">Матеріали: <span className="text-white font-medium">{item.materials_min?.toLocaleString('uk-UA')} - {item.materials_max?.toLocaleString('uk-UA')} ₴</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Де купити:</span>
                        <div className="flex gap-2 flex-wrap">
                          {item.where_to_buy?.map((store: string, j: number) => (
                            <span key={j} className="bg-white/5 px-2 py-1 rounded text-gray-300">{store}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                <h3 className="text-lg font-bold text-[#00FF88] flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5" /> Поради щодо економії
                </h3>
                <ul className="space-y-3">
                  {result.tips?.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="text-center space-y-4 opacity-50 absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Hammer className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-white">Заповніть форму для отримання кошторису</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
