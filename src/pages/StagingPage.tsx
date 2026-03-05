import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, Share2, Download, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const STYLES = [
  { id: 'scandinavian', name: 'Скандинавський', prompt: 'scandinavian style furnished living room, white walls, wood accents, minimal, bright, photorealistic' },
  { id: 'modern', name: 'Сучасний', prompt: 'modern contemporary furnished room, clean lines, neutral colors, photorealistic, luxury' },
  { id: 'industrial', name: 'Індустріальний', prompt: 'industrial loft style furnished room, brick walls, metal accents, dark tones, photorealistic' },
  { id: 'classic', name: 'Класичний', prompt: 'classic european style furnished room, elegant furniture, warm colors, photorealistic' }
];

export default function StagingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.webp'] },
    maxFiles: 1
  } as any);

  const handleGenerate = async () => {
    if (!file) return;
    setIsLoading(true);
    setResults([]);

    try {
      // Convert file to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const stylePrompt = STYLES.find(s => s.id === selectedStyle)?.prompt || '';

      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "" });
      
      const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid image format");
      }
      const mimeType = matches[1];
      const base64Data = matches[2];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `Redesign this empty room into a fully furnished room. Style: ${stylePrompt}. Make it photorealistic and high quality.`,
            },
          ],
        },
      });

      let resultUrls: string[] = [];
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            resultUrls.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          }
        }
      }

      if (resultUrls.length === 0) {
        throw new Error("Failed to generate image from Gemini");
      }

      // Save to backend optionally
      try {
        await fetch('/api/staging/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: base64Image,
            resultUrls: resultUrls,
            style: stylePrompt
          })
        });
      } catch (e) {
        console.error("Failed to save to backend", e);
      }

      setResults(resultUrls);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Помилка генерації. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">AI Стейджинг Інтер'єру</h1>
        <p className="text-gray-400 text-lg">Завантажте фото порожньої кімнати та отримайте 3 варіанти дизайну</p>
      </div>

      <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-8">
        {/* Upload Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-purple-500 bg-purple-500/5' : 'border-white/20 hover:border-white/40 bg-black/20'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative aspect-video max-w-xl mx-auto rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-medium flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Змінити фото
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">Перетягніть фото сюди або натисніть для вибору</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG до 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Style Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Оберіть стиль</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedStyle === style.id 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-500' 
                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                <span className="font-medium">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleGenerate}
          disabled={!file || isLoading}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Генеруємо інтер'єр...
            </>
          ) : (
            'Створити дизайн'
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Результати</h2>
            <a 
              href="https://www.olx.ua/uk/nedvizhimost/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Поділитися на OLX
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {results.map((url, i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 group">
                <div className="relative aspect-[4/3]">
                  <img src={url} alt={`Result ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {/* Watermark for free plan */}
                  <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white/70 font-medium">
                    obiyistya.ua
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Варіант {i + 1}</span>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
