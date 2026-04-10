import React from 'react';
import {
  Calendar,
  Coffee,
  Film,
  Filter,
  HeartPulse,
  Home,
  MoreHorizontal,
  Plane,
  RefreshCw,
  Search,
  ShoppingCart,
  Tag,
  Utensils,
  Zap,
} from 'lucide-react';

import { formatCurrency, formatLongDate, titleCase } from '../utils/finance';

const categoryIconMap = {
  food: Utensils,
  dining: Utensils,
  groceries: ShoppingCart,
  coffee: Coffee,
  drinks: Coffee,
  utilities: Zap,
  entertainment: Film,
  subscription: RefreshCw,
  subscriptions: RefreshCw,
  housing: Home,
  rent: Home,
  travel: Plane,
  transportation: Plane,
  transport: Plane,
  health: HeartPulse,
  medical: HeartPulse,
  shopping: ShoppingCart,
  retail: ShoppingCart,
  other: MoreHorizontal,
  others: MoreHorizontal,
};

function getCategoryIcon(category = '') {
  const normalizedCategory = category.toLowerCase().trim();
  for (const [key, Icon] of Object.entries(categoryIconMap)) {
    if (normalizedCategory.includes(key)) {
      return Icon;
    }
  }
  return Tag;
}

function FilterInput({ icon: Icon, children }) {
  return (
    <div className="relative border border-outline-variant/30 rounded-2xl bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-transparent transition-all shadow-sm">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
      {children}
    </div>
  );
}

function HistoryList({
  history = [],
  filters = { search: '', category: 'all', dateFrom: '', dateTo: '' },
  onFilterChange = () => { },
  categories = []
}) {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <FilterInput icon={Search}>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Search transactions"
            className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
          />
        </FilterInput>

        <FilterInput icon={Filter}>
          <select
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
            className="w-full appearance-none bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-on-surface focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {titleCase(category)}
              </option>
            ))}
          </select>
        </FilterInput>

        <FilterInput icon={Calendar}>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onFilterChange('dateFrom', event.target.value)}
            className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-on-surface focus:outline-none"
          />
        </FilterInput>

        <FilterInput icon={Calendar}>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onFilterChange('dateTo', event.target.value)}
            className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-on-surface focus:outline-none"
          />
        </FilterInput>
      </div>

      {history.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low py-10 text-center text-sm italic font-medium text-on-surface-variant shadow-sm">
          No transactions match the current filters. Try another search, category, or date range.
        </div>
      ) : (
        <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[35px] before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-primary/40 before:via-secondary/30 before:to-transparent">
          {history.map((item, index) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id || `${item.description}-${item.date}-${index}`}
                className="group relative flex items-center justify-between animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute left-[-16px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-surface-container-low bg-surface shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] md:left-4">
                  <Icon className="h-5 w-5 text-outline transition-colors duration-300 group-hover:text-primary" />
                </div>

                <div className="relative ml-12 flex w-full flex-col gap-4 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/20 group-hover:shadow-lg md:ml-20 md:flex-row md:items-center md:justify-between">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"></div>

                  <div className="relative z-10">
                    <div className="font-bold text-on-surface font-manrope">{item.description}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        {titleCase(item.category)}
                      </span>
                      {item.is_recurring && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-secondary/20 bg-secondary/5 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
                          <RefreshCw className="h-3 w-3" />
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-on-surface-variant font-body">{formatLongDate(item.date)}</div>
                  </div>

                  <div className="relative z-10 text-right">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Amount</div>
                    <div className="text-xl font-black tracking-tight text-on-surface font-manrope">{formatCurrency(item.amount)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
