import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseInput from './components/ExpenseInput';
import SpendingChart from './components/SpendingChart';
import HistoryList from './components/HistoryList';

const API_BASE = 'http://127.0.0.1:8000';

export function GlassCard({ title, subtitle, children, className="" }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative h-full bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-purple-500/10">
        <div className="mb-6">
          {title && <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">{title}</h3>}
          {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});

  const fetchData = async () => {
    try {
      const histRes = await axios.get(`${API_BASE}/history/`);
      setHistory(histRes.data);
      const summRes = await axios.get(`${API_BASE}/summary/`);
      setSummary(summRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSpent = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-purple-500/30 relative overflow-hidden pb-20">
      
      {/* Dynamic Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 pt-16 relative z-10">
        <header className="mb-16 text-center animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Groq AI Powered
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-4">
            Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Smarter.</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-lg">Log purchases, let our AI handle the categorization, and watch your financial health visually evolve.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-5 space-y-8">
            <GlassCard title="Log Expense" subtitle="What did you buy? Categorization is automatic.">
              <ExpenseInput onAdded={fetchData} />
            </GlassCard>

            <GlassCard title="Quick Stats" subtitle="Your total expenditure overview.">
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-zinc-500 mb-2 uppercase tracking-widest">Total Spent</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                    ${totalSpent.toFixed(2)}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Visualization & History */}
          <div className="lg:col-span-7 space-y-8">
            <GlassCard title="Spending Breakdown" subtitle="Your expenditures visualized dynamically.">
              <SpendingChart summary={summary} />
            </GlassCard>

            <GlassCard title="Recent Activity" subtitle="Your latest transactions.">
              <HistoryList history={history} />
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
