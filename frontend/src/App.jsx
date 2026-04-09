import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Sparkles, Wallet, BarChart3, Clock, CheckCircle2, LogOut } from 'lucide-react';
import ExpenseInput from './components/ExpenseInput';
import SpendingChart from './components/SpendingChart';
import HistoryList from './components/HistoryList';
import Auth from './components/Auth';

const API_BASE = 'http://127.0.0.1:8000';

export function GlassCard({ title, subtitle, icon: Icon, children, className="", delay="0ms" }) {
  return (
    <div className={`relative group animate-fade-in-up ${className}`} style={{ animationDelay: delay }}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm"></div>
      <div className="relative h-full bg-[#121214]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-purple-500/5 hover:-translate-y-1">
        <div className="mb-6 flex items-start gap-4">
          {Icon && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-colors duration-500">
              <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
            </div>
          )}
          <div>
            {title && <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">{title}</h3>}
            {subtitle && <p className="text-sm text-zinc-500 mt-1 font-medium">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});
  const [latestExpense, setLatestExpense] = useState(null);

  const fetchData = async () => {
    try {
      if (!token) return;
      const histRes = await axios.get(`${API_BASE}/history/`);
      setHistory(histRes.data);
      const summRes = await axios.get(`${API_BASE}/summary/`);
      setSummary(summRes.data);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const handleExpenseAdded = async (newExpense) => {
    setLatestExpense(newExpense);
    setTimeout(() => {
      setLatestExpense(null);
    }, 4000);
    await fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
    setSummary({});
  };

  const totalSpent = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-purple-500/30 relative overflow-hidden pb-32">
      
      {/* Dynamic Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none animate-blob"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-600/15 blur-[150px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '4s' }}></div>

      {!token ? (
        <div className="relative z-10 pt-16">
          <header className="mb-4 text-center animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Powered by Groq</span>
            </div>
          </header>
          <Auth onLogin={setToken} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10">
          
          {/* Toast Notification */}
          {latestExpense && (
            <div className="fixed top-6 right-6 z-50 animate-fade-in-down pointer-events-none">
              <div className="bg-zinc-900/90 backdrop-blur-xl border border-green-500/30 p-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] flex items-center gap-4">
                <div className="bg-green-500/20 text-green-400 p-2.5 rounded-xl border border-green-500/20 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="pr-4">
                  <p className="font-bold text-white text-sm">Expense Logged!</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Saved <span className="text-zinc-200 font-semibold">{latestExpense.description}</span> as 
                    <span className="text-purple-400 uppercase font-black ml-1 tracking-wider">{latestExpense.category}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <header className="mb-20 text-center animate-fade-in-down relative">
            <button 
               onClick={handleLogout}
               className="absolute right-0 top-0 mt-4 md:-top-16 md:mt-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-sm shadow-inner group"
            >
              Logout <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <h1 className="text-7xl font-extrabold tracking-tight mb-6 mt-16 md:mt-0">
              Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-pulse-slow">Smarter.</span>
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed font-medium">Log purchases normally. Let our intelligent AI categorize and organize your financial health automatically.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-8">
              <GlassCard title="Log Expense" subtitle="What did you buy? Categorization is automatic." icon={Activity} delay="100ms">
                <ExpenseInput onAdded={handleExpenseAdded} />
              </GlassCard>

              <GlassCard title="Quick Stats" subtitle="Your total expenditure overview." icon={Wallet} delay="200ms">
                <div className="flex items-center justify-center p-8 mt-2 rounded-2xl bg-zinc-900/30 border border-white/5 shadow-inner">
                  <div className="text-center group overflow-hidden">
                    <div className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-[0.2em] group-hover:text-zinc-400 transition-colors">Total Spent</div>
                    <div key={totalSpent} className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight relative animate-fade-in-up">
                      <span className="absolute -left-6 top-2 text-3xl text-zinc-600 font-bold">$</span>
                      {totalSpent.toFixed(2)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <GlassCard title="Spending Breakdown" subtitle="Your expenditures visually analyzed." icon={BarChart3} delay="300ms">
                <SpendingChart summary={summary} />
              </GlassCard>

              <GlassCard title="Recent Activity" subtitle="Your latest transactions seamlessly logged." icon={Clock} delay="400ms">
                <HistoryList history={history} />
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
