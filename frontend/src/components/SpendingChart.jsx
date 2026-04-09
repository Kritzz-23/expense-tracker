import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Neon and vibrant color palette
const COLORS = ['#a855f7', '#3b82f6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#6366f1'];

function SpendingChart({ summary = {} }) {
  const data = Object.keys(summary).map((key, index) => ({
    name: key.toUpperCase(),
    value: summary[key],
    color: COLORS[index % COLORS.length]
  }));

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-zinc-500 text-sm py-20 italic bg-zinc-900/30 rounded-2xl border border-white/5 animate-pulse-slow">
        <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-zinc-700/50 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        No data to display. Log expenses to populate your chart!
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{ 
                  filter: `drop-shadow(0px 0px 8px ${entry.color}60)` 
                }} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(24, 24, 27, 0.95)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '12px 20px'
            }}
            itemStyle={{ fontWeight: '800', color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Spent']}
          />
          <Legend 
            iconType="circle" 
            wrapperStyle={{ 
              fontSize: '11px', 
              paddingTop: '20px', 
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: '#a1a1aa'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingChart;
