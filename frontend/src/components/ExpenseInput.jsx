import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

function ExpenseInput({ onAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/add-expense/?description=${encodeURIComponent(description)}&amount=${amount}`);
      setDescription('');
      setAmount('');
      if (onAdded) onAdded(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
        <div className="relative">
          <label className="block text-[10px] font-bold text-zinc-400 mb-2 tracking-[0.15em] uppercase">Description</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="e.g. Flight to NYC or Starbucks" 
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all font-medium backdrop-blur-sm"
          />
        </div>
      </div>
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
        <div className="relative">
          <label className="block text-[10px] font-bold text-zinc-400 mb-2 tracking-[0.15em] uppercase">Amount ($)</label>
          <input 
            type="number" 
            step="0.01" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.00" 
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all font-medium backdrop-blur-sm shadow-inner"
          />
        </div>
      </div>
      <div className="pt-2">
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold tracking-wide rounded-xl py-4 px-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing via AI...</span>
            </>
          ) : (
            <>
              <span>Log Expense</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ExpenseInput;
