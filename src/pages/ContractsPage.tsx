import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Copy, CheckCircle2, Edit2, Share2, Save, Lock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

export default function ContractsPage() {
  const navigate = useNavigate();
  const [contractType, setContractType] = useState<'rent' | 'sale'>('rent');
  const [template, setTemplate] = useState<'standard' | 'strict' | 'friendly'>('standard');
  const [isPro, setIsPro] = useState(false);
  
  useEffect(() => {
    const savedStatus = localStorage.getItem('app_subscription');
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      if (status.isActive && (status.plan.includes('PRO') || status.plan.includes('ENTERPRISE'))) {
        setIsPro(true);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    date: '',
    partyA: '',
    partyB: '',
    address: '',
    price: '',
    term: '',
    inventory: '',
    additionalTerms: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<string>('');
  const [shared, setShared] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      // Mock response for "без апі роби"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let generatedText = `**ДОГОВІР ${contractType === 'rent' ? 'ОРЕНДИ' : 'КУПІВЛІ-ПРОДАЖУ'} КВАРТИРИ**\n\n`;
      generatedText += `**Місто Київ**\n**Дата:** ${formData.date}\n\n`;
      generatedText += `Ми, що нижче підписалися:\n`;
      generatedText += `**${contractType === 'rent' ? 'Орендодавець' : 'Продавець'}:** ${formData.partyA}, з однієї сторони, та\n`;
      generatedText += `**${contractType === 'rent' ? 'Орендар' : 'Покупець'}:** ${formData.partyB}, з іншої сторони,\n`;
      generatedText += `уклали цей договір про наступне:\n\n`;
      generatedText += `**1. ПРЕДМЕТ ДОГОВОРУ**\n`;
      generatedText += `1.1. ${contractType === 'rent' ? 'Орендодавець передає, а Орендар приймає в строкове платне користування' : 'Продавець передає у власність, а Покупець приймає'} квартиру за адресою: ${formData.address}.\n\n`;
      generatedText += `**2. ВАРТІСТЬ ТА ПОРЯДОК РОЗРАХУНКІВ**\n`;
      generatedText += `2.1. ${contractType === 'rent' ? 'Орендна плата становить' : 'Вартість квартири становить'} ${formData.price} грн.\n`;
      if (contractType === 'rent') {
        generatedText += `2.2. Термін оренди: ${formData.term}.\n\n`;
      } else {
        generatedText += `\n`;
      }
      if (formData.inventory) {
        generatedText += `**3. ПЕРЕЛІК МАЙНА ТА ВІДПОВІДАЛЬНІСТЬ**\n`;
        generatedText += `3.1. ${formData.inventory}\n\n`;
      }
      if (formData.additionalTerms) {
        generatedText += `**4. ДОДАТКОВІ УМОВИ**\n`;
        generatedText += `4.1. ${formData.additionalTerms}\n\n`;
      }
      generatedText += `**ПІДПИСИ СТОРІН:**\n\n`;
      generatedText += `_________________ /${formData.partyA}/\n\n`;
      generatedText += `_________________ /${formData.partyB}/`;

      setResult(generatedText);
      setEditedResult(generatedText);
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Помилка генерації. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedResult : (result || '');
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const textToShare = isEditing ? editedResult : (result || '');
    if (!textToShare) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: contractType === 'rent' ? 'Договір оренди' : 'Договір купівлі-продажу',
          text: textToShare,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: copy to clipboard and alert
      handleCopy();
      alert('Посилання/текст скопійовано в буфер обміну (ваш браузер не підтримує нативне поширення).');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Генератор договорів</h1>
        <p className="text-gray-400 text-lg">Автоматичне створення юридично правильних договорів оренди та купівлі-продажу</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Form */}
        <div className="md:col-span-4 bg-white/5 p-8 rounded-3xl border border-white/5 h-fit">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Тип договору</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="contractType"
                    value="rent"
                    checked={contractType === 'rent'}
                    onChange={() => setContractType('rent')}
                    className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-purple-500 transition-colors cursor-pointer peer"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-purple-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className={`text-sm font-medium transition-colors ${contractType === 'rent' ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  Оренда
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="contractType"
                    value="sale"
                    checked={contractType === 'sale'}
                    onChange={() => setContractType('sale')}
                    className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-purple-500 transition-colors cursor-pointer peer"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-purple-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className={`text-sm font-medium transition-colors ${contractType === 'sale' ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  Купівля-продаж
                </span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Шаблон договору</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplate('standard')}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
                  template === 'standard' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                Стандартний
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPro) setTemplate('strict');
                  else navigate('/subscription');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-1 ${
                  template === 'strict' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {!isPro && <Lock className="w-3 h-3" />}
                Суворий
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPro) setTemplate('friendly');
                  else navigate('/subscription');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-1 ${
                  template === 'friendly' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {!isPro && <Lock className="w-3 h-3" />}
                Простий
              </button>
            </div>
            {!isPro && (
              <p className="text-xs text-purple-400 mt-2">
                * Суворий та Простий шаблони доступні лише за підпискою Pro
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Дата укладення договору</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {contractType === 'rent' ? 'ПІБ Орендодавця' : 'ПІБ Продавця'}
                </label>
                <input
                  type="text"
                  name="partyA"
                  value={formData.partyA}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="Іванов Іван Іванович"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {contractType === 'rent' ? 'ПІБ Орендаря' : 'ПІБ Покупця'}
                </label>
                <input
                  type="text"
                  name="partyB"
                  value={formData.partyB}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="Петров Петро Петрович"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Адреса нерухомості</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="м. Київ, вул. Хрещатик, 1, кв. 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {contractType === 'rent' ? 'Орендна плата (грн/міс)' : 'Вартість (грн)'}
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="15000"
                />
              </div>

              {contractType === 'rent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Термін оренди</label>
                  <input
                    type="text"
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="11 місяців"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Майно та компенсація (що є в квартирі і ціна за пошкодження)
                </label>
                <textarea
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none mb-4"
                  placeholder="Наприклад: Телевізор Samsung - 15000 грн, Диван - 20000 грн..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Додаткові умови (необов'язково)</label>
                <textarea
                  name="additionalTerms"
                  value={formData.additionalTerms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                  placeholder="Наприклад: проживання з тваринами заборонено..."
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
                  Генерація...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Створити договір
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-8 bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col relative overflow-hidden min-h-[600px]">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" /> 
                  Готовий документ
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setResult(editedResult);
                      }
                      setIsEditing(!isEditing);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isEditing ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    {isEditing ? <><Save className="w-4 h-4" /> Зберегти</> : <><Edit2 className="w-4 h-4" /> Редагувати</>}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white"
                  >
                    {shared ? <CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> : <Share2 className="w-4 h-4" />}
                    Поділитися
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-[#00FF88]" /> : <Copy className="w-4 h-4" />}
                    Копіювати
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isEditing ? (
                  <textarea
                    value={editedResult}
                    onChange={(e) => setEditedResult(e.target.value)}
                    className="w-full h-full min-h-[500px] bg-white text-black p-8 rounded-xl font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                ) : (
                  <div className="bg-white text-black p-8 rounded-xl min-h-full font-serif text-sm leading-relaxed prose prose-sm max-w-none">
                    <Markdown>{result}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-purple-500/50" />
              </div>
              <p className="text-xl font-medium text-gray-400 mb-2">Документ ще не згенеровано</p>
              <p className="max-w-md">Заповніть форму зліва та натисніть "Створити договір", щоб отримати готовий юридичний документ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
