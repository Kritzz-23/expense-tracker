import React, { useState } from 'react';
import axios from 'axios';

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
      await axios.post(`${API_BASE}/add-expense/?description=${encodeURIComponent(description)}&amount=${amount}`);
      setDescription('');
      setAmount('');
      if (onAdded) onAdded();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 tracking-wide uppercase">Description</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="e.g. Flight to NYC or Starbucks" 
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 tracking-wide uppercase">Amount ($)</label>
        <input 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="0.00" 
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
        />
      </div>
      <div className="pt-4">
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold tracking-wide rounded-xl py-3 px-6 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Processing via AI...' : 'Log Expense'}
        </button>
      </div>
    </form>
  );
}

export default ExpenseInput;
