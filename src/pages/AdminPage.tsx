import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Activity, DollarSign, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  recentUsers: UserData[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: any;
  balance: number;
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!profile || profile.role !== 'ADMIN') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch users from Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers: UserData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedUsers.push({
            id: doc.id,
            name: data.name || 'Без імені',
            email: data.email,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            balance: data.balance || 0
          });
        });

        setUsers(fetchedUsers);
        setStats({
          totalUsers: fetchedUsers.length,
          totalTransactions: 150, // Mock data for now
          totalRevenue: 45000, // Mock data for now
          recentUsers: fetchedUsers.slice(0, 5)
        });
        
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        setError(err.message || 'Error loading admin panel');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [profile]);

  if (!user || profile?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Доступ заборонено</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Ця сторінка доступна лише для адміністраторів.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Адмін Панель</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Управління користувачами та статистика платформи
          </p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-[#1A1A1A] p-1 rounded-xl border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Дашборд
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'users'
                ? 'bg-white dark:bg-[#2A2A2A] text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Користувачі
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Всього користувачів</h3>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.totalUsers}</p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Транзакцій</h3>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.totalTransactions}</p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Загальний дохід</h3>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.totalRevenue.toLocaleString()} ₴</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Останні реєстрації</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="pb-3 font-medium">Ім'я</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Роль</th>
                    <th className="pb-3 font-medium">Дата реєстрації</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {stats.recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 text-gray-900 dark:text-gray-200 font-medium">{u.name}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('uk-UA')}
                      </td>
                    </tr>
                  ))}
                  {stats.recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">Немає користувачів</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold dark:text-white">Всі користувачі</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Всього: {users.length}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="pb-3 font-medium">Ім'я</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Баланс</th>
                  <th className="pb-3 font-medium">Роль</th>
                  <th className="pb-3 font-medium">Дата реєстрації</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 text-gray-900 dark:text-gray-200 font-medium">{u.name}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="py-3 text-gray-900 dark:text-gray-200">
                      {u.balance || 0} кр.
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">Немає користувачів</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
