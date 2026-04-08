import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

function SpendingChart({ summary = {} }) {
  const data = Object.keys(summary).map((key, index) => ({
    name: key.toUpperCase(),
    value: summary[key],
    color: COLORS[index % COLORS.length]
  }));

  if (data.length === 0) {
    return <div className="text-zinc-500 text-center text-sm py-16 italic bg-zinc-900/30 rounded-2xl border border-white/5">No data to display. Log expenses to populate your chart!</div>;
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
            cornerRadius={8}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 6px ${entry.color}40)` }} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ fontWeight: 'bold', color: '#f4f4f5' }}
          />
          <Legend 
            iconType="circle" 
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: '600' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingChart;
