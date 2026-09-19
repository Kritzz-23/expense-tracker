import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Sparkles, Wallet, BarChart3, Clock, CheckCircle2, LogOut, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { API_BASE } from './config';
import ExpenseInput from './components/ExpenseInput';
import SpendingChart from './components/SpendingChart';
import HistoryList from './components/HistoryList';
import Auth from './components/Auth';
import InsightsCard from './components/InsightsCard';
import BudgetCard from './components/BudgetCard';
import RecurringExpenses from './components/RecurringExpenses';
import ChatWidget from './components/ChatWidget';

export function GlassCard({ id, title, subtitle, icon: Icon, children, className = "", delay = "0ms" }) {
  return (
    <div id={id} className={`relative group animate-fade-in-up scroll-mt-32 ${className}`} style={{ animationDelay: delay }}>
      <div className="relative h-full bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-8 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        <div className="mb-6 flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 transition-colors duration-500 group-hover:bg-primary/10">
              <Icon className="w-6 h-6 text-primary transition-colors duration-300" />
            </div>
          )}
          <div>
            {title && <h3 className="text-xl font-bold font-manrope text-on-surface">{title}</h3>}
            {subtitle && <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{subtitle}</p>}
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
  const [insights, setInsights] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [budget, setBudget] = useState(null);
  const [recurring, setRecurring] = useState([]);
  const [savingBudget, setSavingBudget] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState('weekly');
  const [analyticsDateFrom, setAnalyticsDateFrom] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [analyticsDateTo, setAnalyticsDateTo] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [historyFilters, setHistoryFilters] = useState({ search: '', category: 'all', dateFrom: '', dateTo: '' });
  const [latestExpense, setLatestExpense] = useState(null);

  const fetchData = async () => {
    try {
      if (!token) return;

      const historyQuery = new URLSearchParams();
      if (historyFilters.search) historyQuery.append('search', historyFilters.search);
      if (historyFilters.category && historyFilters.category !== 'all') historyQuery.append('category', historyFilters.category);
      if (historyFilters.dateFrom) historyQuery.append('date_from', historyFilters.dateFrom);
      if (historyFilters.dateTo) historyQuery.append('date_to', historyFilters.dateTo);

      const [histRes, summRes, insightsRes, analyticsRes, budgetRes, recurringRes] = await Promise.all([
        axios.get(`${API_BASE}/history/?${historyQuery.toString()}`),
        axios.get(`${API_BASE}/summary/`),
        axios.get(`${API_BASE}/insights/`),
        axios.get(`${API_BASE}/analytics?range=${analyticsRange}${analyticsRange === 'manual' ? `&date_from=${analyticsDateFrom}&date_to=${analyticsDateTo}` : ''}`),
        axios.get(`${API_BASE}/budget`),
        axios.get(`${API_BASE}/recurring`),
      ]);
      setHistory(histRes.data);
      setSummary(summRes.data);
      setInsights(insightsRes.data);
      setAnalytics(analyticsRes.data);
      setBudget(budgetRes.data);
      setRecurring(recurringRes.data);
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

      const timer = setTimeout(() => fetchData(), 300);
      return () => clearTimeout(timer);
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, analyticsRange, analyticsDateFrom, analyticsDateTo, historyFilters]);

  const handleExpenseAdded = async (newExpense) => {
    setLatestExpense(newExpense);
    setTimeout(() => {
      setLatestExpense(null);
    }, 4000);
    await fetchData();
  };

  const handleSaveBudget = async (monthlyLimit) => {
    setSavingBudget(true);
    try {
      const res = await axios.post(`${API_BASE}/budget`, { monthly_limit: monthlyLimit });
      setBudget(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingBudget(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
    setSummary({});
    setInsights({});
    setAnalytics(null);
    setBudget(null);
    setRecurring([]);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalSpent = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container relative overflow-hidden pb-32" id="overview">

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl transition-all duration-300 border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-on-surface font-manrope cursor-pointer" onClick={() => scrollToSection('overview')}>
            Expense Tracker
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('overview')} className="text-on-surface-variant font-manrope tracking-tight text-sm font-semibold hover:text-primary transition-colors duration-300">Overview</button>
            <button onClick={() => scrollToSection('expenses')} className="text-on-surface-variant font-manrope tracking-tight text-sm font-semibold hover:text-primary transition-colors duration-300">Expenses</button>
            <button onClick={() => scrollToSection('insights')} className="text-on-surface-variant font-manrope tracking-tight text-sm font-semibold hover:text-primary transition-colors duration-300">AI Insights</button>
          </div>
          <div className="flex items-center gap-4">
            {token && (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-outline-variant/30 text-on-surface-variant px-4 py-2 rounded-xl font-manrope tracking-tight text-sm font-semibold hover:bg-surface-container-low focus:ring-2 focus:ring-primary/20 active:scale-95 flex items-center gap-2 transition-all"
              >
                Logout <LogOut className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {!token ? (
        <div className="relative z-10 pt-32 px-8">
          <header className="mb-4 text-center animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-6 cursor-default">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered by Groq</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-manrope tracking-tight text-on-surface leading-[1.1] mb-6">
              Welcome to <span className="text-primary italic">Expense Tracker.</span>
            </h1>
          </header>
          <Auth onLogin={setToken} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">

          {/* Toast Notification */}
          {latestExpense && (
            <div className="fixed top-24 right-6 z-50 animate-fade-in-down pointer-events-none">
              <div className="bg-surface-container-lowest border border-primary-container/30 p-4 rounded-xl shadow-lg flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full border border-primary/20 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="pr-4">
                  <p className="font-bold text-on-surface text-sm font-manrope">Expense Logged!</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Saved <span className="text-on-surface font-semibold">{latestExpense.description}</span> as
                    <span className="text-primary uppercase font-bold ml-1 tracking-wider">{latestExpense.category}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <header className="mb-16 text-center animate-fade-in-down">
            <h1 className="text-5xl md:text-6xl font-extrabold font-manrope tracking-tight text-on-surface leading-[1.1] mb-6">
              Track <span className="text-primary italic">Smarter.</span>
            </h1>
            <p className="text-on-surface-variant max-w-xl mx-auto text-lg leading-relaxed font-body">Log purchases normally. Let our intelligent AI categorize and organize your financial health automatically.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <GlassCard title="Log Expense" subtitle="What did you buy? Categorization is automatic." icon={Activity} delay="100ms">
                <ExpenseInput onAdded={handleExpenseAdded} />
              </GlassCard>

              <GlassCard title="Monthly Budget" subtitle="Set and track your monthly spending limit." icon={Target} delay="150ms">
                <BudgetCard budget={budget} onSaveBudget={handleSaveBudget} saving={savingBudget} />
              </GlassCard>

              <GlassCard title="Quick Stats" subtitle="Your total expenditure overview." icon={Wallet} delay="200ms">
                <div className="flex items-center justify-center p-8 mt-2 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-sm">
                  <div className="text-center group overflow-hidden">
                    <div className="text-xs font-bold text-outline mb-3 uppercase tracking-[0.2em]">Total Spent</div>
                    <div key={totalSpent} className="text-6xl font-black font-manrope text-on-surface tracking-tight relative animate-fade-in-up">
                      <span className="absolute -left-6 top-2 text-3xl text-on-surface-variant font-bold">₹</span>
                      {totalSpent.toFixed(2)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <GlassCard id="insights" title="AI Insights" subtitle="Predictive intelligence on your spending habits." icon={Lightbulb} delay="250ms">
                <InsightsCard insights={insights} />
              </GlassCard>

              <GlassCard title="Spending Breakdown" subtitle="Your expenditures visually analyzed." icon={BarChart3} delay="300ms">
                <SpendingChart
                  summary={summary}
                  analytics={analytics}
                  analyticsRange={analyticsRange}
                  onRangeChange={setAnalyticsRange}
                  dateFrom={analyticsDateFrom}
                  dateTo={analyticsDateTo}
                  onDateFromChange={setAnalyticsDateFrom}
                  onDateToChange={setAnalyticsDateTo}
                />
              </GlassCard>

              <GlassCard id="expenses" title="Recent Activity" subtitle="Your latest transactions seamlessly logged." icon={Clock} delay="400ms">
                <HistoryList
                  history={history}
                  filters={historyFilters}
                  onFilterChange={(key, value) => setHistoryFilters(prev => ({ ...prev, [key]: value }))}
                  categories={Object.keys(summary)}
                />
              </GlassCard>

              <GlassCard title="Recurring Expenses" subtitle="Predicted upcoming payments based on your logged history." icon={RefreshCw} delay="500ms">
                <RecurringExpenses recurring={recurring} />
              </GlassCard>
            </div>
          </div>

          <ChatWidget />
        </div>
      )}
    </div>
  );
}

export default App;
