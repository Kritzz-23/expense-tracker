import React, { useState } from 'react';
import axios from 'axios';
import { AlignLeft, Loader2, Plane, Send, Sparkles, Utensils, Wallet } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

const QUICK_ADDS = [
  { label: '+₹100 Food', description: 'Quick lunch', amount: '100', icon: Utensils },
  { label: '+₹50 Transport', description: 'Local commute', amount: '50', icon: Plane },
  { label: '+₹299 Subscription', description: 'Streaming subscription', amount: '299', icon: Sparkles },
];

function ExpenseInput({ onAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const submitExpense = async (nextDescription, nextAmount) => {
    if (!nextDescription || !nextAmount) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/add-expense/?description=${encodeURIComponent(nextDescription)}&amount=${nextAmount}`
      );
      setDescription('');
      setAmount('');
      if (onAdded) onAdded(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitExpense(description, amount);
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK_ADDS.map(({ label, description: quickDescription, amount: quickAmount, icon: Icon }) => (
          <button
            key={label}
            type="button"
            disabled={loading}
            onClick={() => submitExpense(quickDescription, quickAmount)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-50 shadow-sm"
          >
            <Icon className="h-4 w-4 text-primary" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl bg-primary/20 opacity-0 blur-sm transition duration-500 group-hover:opacity-100"></div>
          <div className="relative">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-outline">
              Description
            </label>
            <div className="relative">
              <AlignLeft className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. grocery run, metro recharge, rent"
                className="w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low py-4 pl-11 pr-5 text-on-surface placeholder:text-outline backdrop-blur-sm transition-all font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-2xl bg-primary/20 opacity-0 blur-sm transition duration-500 group-hover:opacity-100"></div>
          <div className="relative">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-outline">
              Amount (₹)
            </label>
            <div className="relative">
              <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-outline">
                INR
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low py-4 pl-11 pr-16 text-on-surface placeholder:text-outline shadow-sm backdrop-blur-sm transition-all font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-container/20 bg-primary/5 p-4 text-sm text-on-surface-variant font-medium">
          AI will categorize the expense automatically and flag repeating patterns when they start looking recurring.
        </div>

        <button
          disabled={loading}
          type="submit"
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-6 py-4 font-bold tracking-wide shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing via AI...</span>
            </>
          ) : (
            <>
              <span>Log Expense</span>
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ExpenseInput;
