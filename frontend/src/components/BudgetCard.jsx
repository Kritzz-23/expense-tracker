import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Target, Wallet } from 'lucide-react';

import { formatCurrency, getBudgetMeta } from '../utils/finance';

function BudgetCard({ budget, onSaveBudget, saving }) {
  const [limitInput, setLimitInput] = useState('');
  const budgetMeta = getBudgetMeta(budget?.status);
  const utilization = Math.min(Number(budget?.utilization || 0), 100);

  useEffect(() => {
    setLimitInput(budget?.monthly_limit ? String(budget.monthly_limit) : '');
  }, [budget?.monthly_limit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!limitInput) return;
    await onSaveBudget(Number(limitInput));
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
          Monthly Budget
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={limitInput}
              onChange={(event) => setLimitInput(event.target.value)}
              placeholder="Set your monthly limit"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-4 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-600 transition-all font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-500/10 disabled:pointer-events-none disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4 text-cyan-300" />}
            Save Budget
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">This Month</div>
          <div className="text-lg font-black text-white">{formatCurrency(budget?.spent_this_month || 0)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Limit</div>
          <div className="text-lg font-black text-white">
            {budget?.monthly_limit ? formatCurrency(budget.monthly_limit) : 'Not set'}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Remaining</div>
          <div className={`text-lg font-black ${(budget?.remaining || 0) < 0 ? 'text-red-300' : 'text-white'}`}>
            {budget?.remaining === null ? 'Set budget' : formatCurrency(budget.remaining)}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${budgetMeta.tone}`}>
        <div className="mb-3 flex items-center gap-2 font-semibold">
          {budget?.status === 'healthy' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{budgetMeta.label}</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em]">
          <span>{budget?.month_label || 'Current Month'}</span>
          <span>{Number(budget?.utilization || 0).toFixed(0)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-black/30">
          <div
            className={`h-full rounded-full transition-all duration-500 ${budgetMeta.progressClass}`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;
