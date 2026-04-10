import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, CalendarRange, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

import { formatCurrency } from '../utils/finance';

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#14b8a6'];

function SpendingChart({
  summary = {},
  analytics,
  analyticsRange,
  onRangeChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}) {
  const pieData = Object.keys(summary).map((key, index) => ({
    name: key.toUpperCase(),
    value: summary[key],
    color: COLORS[index % COLORS.length],
  }));

  const trendData = analytics?.trend || [];
  const categoryData = (analytics?.categories || []).map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));
  const hasData = pieData.length > 0 || trendData.length > 0 || categoryData.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-10 text-center text-sm italic text-on-surface-variant shadow-sm">
        No analytics yet. Log a few expenses to unlock the pie, trend, and category charts.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[70%]">
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-outline">
                <CalendarRange className="h-4 w-4 text-primary" />
                Selected Range
              </div>
              <div className="text-xl font-black text-on-surface">
                {analyticsRange === 'weekly' ? 'Last 7 Days' : analyticsRange === 'monthly' ? 'Last 6 Weeks' : 'Custom Dates'}
              </div>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-outline">
                <LineChartIcon className="h-4 w-4 text-secondary" />
                Range Total
              </div>
              <div className="text-xl font-black text-on-surface">{formatCurrency(analytics?.total || 0)}</div>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-outline">
                <BarChart3 className="h-4 w-4 text-primary-container" />
                Change
              </div>
              <div className={`text-xl font-black ${(analytics?.change_percent || 0) >= 0 ? 'text-primary' : 'text-error'}`}>
                {(analytics?.change_percent || 0) >= 0 ? '+' : ''}
                {Number(analytics?.change_percent || 0).toFixed(2)}%
              </div>
            </div>
          </div>

          {onRangeChange && (
            <div className="inline-flex rounded-2xl border border-outline-variant/20 bg-surface-container-low p-1 shadow-sm overflow-x-auto max-w-full">
              {['weekly', 'monthly', 'manual'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onRangeChange(option)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 capitalize ${analyticsRange === option
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {analyticsRange === 'manual' && (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up mt-2 p-2 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10">
            <div className="flex-1 w-full relative border border-outline-variant/30 rounded-2xl bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-transparent transition-all shadow-sm">
              <div className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-outline">From</div>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange?.(e.target.value)}
                className="w-full bg-transparent py-3 px-4 text-sm font-medium text-on-surface focus:outline-none rounded-2xl"
              />
            </div>
            <div className="flex-1 w-full relative border border-outline-variant/30 rounded-2xl bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-transparent transition-all shadow-sm">
              <div className="absolute -top-2.5 left-4 px-1 bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-outline">To</div>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange?.(e.target.value)}
                className="w-full bg-transparent py-3 px-4 text-sm font-medium text-on-surface focus:outline-none rounded-2xl"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary-container" />
            <div>
              <h4 className="text-lg font-bold text-on-surface font-manrope">Category Comparison</h4>
              <p className="text-sm text-on-surface-variant">See which buckets are driving the current range.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="category" stroke="#6c7a71" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6c7a71"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Math.round(value)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    color: '#191c1d',
                    fontWeight: 600
                  }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
                <Bar dataKey="amount" radius={[8, 8, 4, 4]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`${entry.category}-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <div>
              <h4 className="text-lg font-bold text-on-surface font-manrope">Overall Breakdown</h4>
              <p className="text-sm text-on-surface-variant">Your existing category split, visualized clearly.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={12}
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}44)` }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    color: '#191c1d',
                    fontWeight: 600
                  }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px',
                    paddingTop: '20px',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    color: '#6c7a71',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <LineChartIcon className="h-5 w-5 text-secondary" />
          <div>
            <h4 className="text-lg font-bold text-on-surface font-manrope">Spending Trend</h4>
            <p className="text-sm text-on-surface-variant">
              {analyticsRange === 'weekly' ? 'Daily spending movement' : 'Weekly spending movement'}
            </p>
          </div>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="#6c7a71" tickLine={false} axisLine={false} />
              <YAxis
                stroke="#6c7a71"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Math.round(value)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  color: '#191c1d',
                  fontWeight: 600
                }}
                itemStyle={{ color: '#006c49' }}
                formatter={(value) => [formatCurrency(value), 'Spent']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ stroke: '#10b981', strokeWidth: 3, r: 5, fill: '#ffffff' }}
                activeDot={{ r: 8, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;
