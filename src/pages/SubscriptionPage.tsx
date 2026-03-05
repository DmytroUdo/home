import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Loader2, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionStatus {
  plan: string;
  status: string;
  isActive: boolean;
  isGracePeriod: boolean;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      // In a real app, this would use an authenticated fetch
      // For demo, we'll mock the response if no real backend is connected
      const savedStatus = localStorage.getItem('app_subscription');
      if (savedStatus) {
        setStatus(JSON.parse(savedStatus));
      } else {
        setStatus({
          plan: 'INACTIVE',
          status: 'INACTIVE',
          isActive: false,
          isGracePeriod: false,
          currentPeriodEnd: new Date().toISOString(),
          cancelAtPeriodEnd: false
        });
      }
    } catch (err) {
      console.error(err);
      // Mock data for preview
      setStatus({
        plan: 'INACTIVE',
        status: 'INACTIVE',
        isActive: false,
        isGracePeriod: false,
        currentPeriodEnd: new Date().toISOString(),
        cancelAtPeriodEnd: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      setError('Будь ласка, увійдіть в систему для оформлення підписки');
      return;
    }

    setActionLoading(true);
    setError(null);
    
    try {
      const fullPlanName = `${plan}_${billingCycle.toUpperCase()}`;
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStatus = {
        plan: fullPlanName,
        status: 'ACTIVE',
        isActive: true,
        isGracePeriod: false,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      };
      
      setStatus(newStatus);
      localStorage.setItem('app_subscription', JSON.stringify(newStatus));
      
      // In a real app:
      // const res = await fetch('/api/subscription/create', { ... })
      // if (!res.ok) throw new Error(...)
      
    } catch (err: any) {
      setError(err.message || 'Помилка при оформленні підписки');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (status) {
        const newStatus = {
          ...status,
          cancelAtPeriodEnd: true,
          isGracePeriod: true
        };
        setStatus(newStatus);
        localStorage.setItem('app_subscription', JSON.stringify(newStatus));
      }
    } catch (err: any) {
      setError(err.message || 'Помилка при скасуванні підписки');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (status) {
        const newStatus = {
          ...status,
          cancelAtPeriodEnd: false,
          isGracePeriod: false
        };
        setStatus(newStatus);
        localStorage.setItem('app_subscription', JSON.stringify(newStatus));
      }
    } catch (err: any) {
      setError(err.message || 'Помилка при відновленні підписки');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const getPlanDisplayName = (planCode: string) => {
    if (planCode.includes('PRO')) return 'Pro';
    if (planCode.includes('ENTERPRISE')) return 'Enterprise';
    return 'Безкоштовний';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Управління підпискою
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Оберіть план, який найкраще підходить для ваших потреб у сфері нерухомості.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Current Status Card */}
      <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
              Поточний план: {status?.isActive ? getPlanDisplayName(status.plan) : 'Безкоштовний'}
            </h2>
            
            {status?.isActive && (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status.isGracePeriod ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                  Статус: {status.isGracePeriod ? 'Скасовано (Діє до кінця періоду)' : 'Активний (Автоподовження)'}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Наступний платіж / Кінець доступу: {new Date(status.currentPeriodEnd).toLocaleDateString('uk-UA')}
                </p>
              </div>
            )}
          </div>

          <div>
            {status?.isActive ? (
              status.isGracePeriod ? (
                <button
                  onClick={handleReactivate}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Відновити підписку
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Скасувати підписку
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-[#1A1A1A] p-1 rounded-2xl border border-gray-200 dark:border-white/10 inline-flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Щомісяця
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-3 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Щорічно
            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Pro Plan */}
        <div className={`bg-white dark:bg-[#111111] rounded-3xl p-8 border ${
          status?.plan.includes('PRO') && status?.isActive
            ? 'border-purple-500 shadow-lg shadow-purple-500/10'
            : 'border-gray-200 dark:border-white/10'
        } relative overflow-hidden`}>
          {status?.plan.includes('PRO') && status?.isActive && (
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              ПОТОЧНИЙ ПЛАН
            </div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Для приватних рієлторів та інвесторів</p>
          
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {billingCycle === 'monthly' ? '499' : '4790'} ₴
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{billingCycle === 'monthly' ? 'міс' : 'рік'}
            </span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'До 50 генерацій стейджингу на місяць',
              'Детальна аналітика ринку (всі міста)',
              'Генерація кошторисів ремонту',
              'Базові шаблони договорів',
              'Пріоритетна підтримка'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe('PRO')}
            disabled={actionLoading || (status?.plan.includes('PRO') && status?.isActive)}
            className={`w-full py-4 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 ${
              status?.plan.includes('PRO') && status?.isActive
                ? 'bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
            }`}
          >
            {actionLoading && !status?.plan.includes('PRO') ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {status?.plan.includes('PRO') && status?.isActive ? 'Активний' : 'Оформити Pro'}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className={`bg-gray-900 dark:bg-[#1A1A1A] rounded-3xl p-8 border ${
          status?.plan.includes('ENTERPRISE') && status?.isActive
            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
            : 'border-gray-800 dark:border-white/10'
        } relative overflow-hidden`}>
          {status?.plan.includes('ENTERPRISE') && status?.isActive && (
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              ПОТОЧНИЙ ПЛАН
            </div>
          )}
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <p className="text-gray-400 mb-6">Для агентств нерухомості та забудовників</p>
          
          <div className="mb-8">
            <span className="text-4xl font-bold text-white">
              {billingCycle === 'monthly' ? '1499' : '14390'} ₴
            </span>
            <span className="text-gray-400">
              /{billingCycle === 'monthly' ? 'міс' : 'рік'}
            </span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Безлімітний стейджинг',
              'Розширена аналітика з API доступом',
              'Кастомні шаблони договорів',
              'Командний доступ (до 10 користувачів)',
              'Персональний менеджер'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe('ENTERPRISE')}
            disabled={actionLoading || (status?.plan.includes('ENTERPRISE') && status?.isActive)}
            className={`w-full py-4 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 ${
              status?.plan.includes('ENTERPRISE') && status?.isActive
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 text-gray-900 shadow-md'
            }`}
          >
            {actionLoading && !status?.plan.includes('ENTERPRISE') ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {status?.plan.includes('ENTERPRISE') && status?.isActive ? 'Активний' : 'Оформити Enterprise'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
