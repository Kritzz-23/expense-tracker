import React from 'react';
import { 
  ShoppingCart, Coffee, Utensils, Zap, Film, Box, Home, 
  Plane, HeartPulse, MoreHorizontal, Tag 
} from 'lucide-react';

const categoryIconMap = {
  'food': Utensils,
  'dining': Utensils,
  'groceries': ShoppingCart,
  'coffee': Coffee,
  'drinks': Coffee,
  'utilities': Zap,
  'entertainment': Film,
  'subscription': Box,
  'housing': Home,
  'travel': Plane,
  'transportation': Plane,
  'health': HeartPulse,
  'medical': HeartPulse,
  'shopping': ShoppingCart,
  'retail': ShoppingCart,
  'other': MoreHorizontal
};

function getCategoryIcon(category = '') {
  const normCat = category.toLowerCase().trim();
  for (const [key, Icon] of Object.entries(categoryIconMap)) {
    if (normCat.includes(key)) {
      return Icon;
    }
  }
  return Tag;
}

function HistoryList({ history = [] }) {
  if (history.length === 0) {
    return <div className="text-zinc-500 text-sm py-8 text-center italic font-medium bg-zinc-900/30 rounded-2xl border border-white/5 animate-fade-in-up">No history yet. Start logging expenses!</div>;
  }

  const displayHistory = [...history].reverse().slice(0, 6);

  return (
    <div className="relative mt-8 pl-4 space-y-8 before:absolute before:inset-0 before:ml-[34px] before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-blue-500/30 before:to-transparent">
      {displayHistory.map((item, i) => {
        const Icon = getCategoryIcon(item.category);
        return (
          <div 
            key={i} 
            className="relative flex items-center justify-between group animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Timeline Node Icon */}
            <div className="absolute left-[-16px] md:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#121214] flex items-center justify-center border-2 border-zinc-800 group-hover:border-purple-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Icon className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 transition-colors duration-300" />
            </div>

            {/* Content Container */}
            <div className="ml-12 md:ml-20 w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center group-hover:bg-zinc-800/60 group-hover:border-white/10 transition-all duration-300 group-hover:-translate-y-1 shadow-lg shadow-black/20 group-hover:shadow-purple-500/5 hover:cursor-default relative overflow-hidden">
               {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">{item.description}</div>
                <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase font-bold tracking-[0.1em] text-purple-400/80 group-hover:text-purple-300 transition-colors">
                  {item.category}
                </div>
              </div>
              
              <div className="relative z-10 text-right pr-2">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400/80 transition-colors">Amount</div>
                <div className="font-black text-zinc-100 tracking-tight text-xl flex items-start gap-1">
                  <span className="text-zinc-500 text-sm mt-1">$</span>
                  {parseFloat(item.amount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryList;
