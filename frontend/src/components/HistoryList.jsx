import React from 'react';

function HistoryList({ history = [] }) {
  if (history.length === 0) {
    return <div className="text-zinc-500 text-sm py-8 text-center italic font-medium bg-zinc-900/30 rounded-2xl border border-white/5">No history yet. Start logging expenses!</div>;
  }

  const displayHistory = [...history].reverse().slice(0, 6);

  return (
    <div className="space-y-4">
      {displayHistory.map((item, i) => (
        <div key={i} className="group flex justify-between items-center p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
               <span className="text-lg">💸</span>
            </div>
            <div>
              <div className="font-bold text-zinc-200">{item.description}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mt-1">{item.category}</div>
            </div>
          </div>
          <div className="font-bold text-zinc-100 tracking-wide text-lg relative px-4">
            <span className="absolute -left-2 top-0 bottom-0 w-px bg-white/10 group-hover:bg-purple-500/50 transition-colors"></span>
            ${parseFloat(item.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
