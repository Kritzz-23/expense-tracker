import React from 'react';
import { BellRing, Calendar, RefreshCw } from 'lucide-react';

import { formatCurrency, formatLongDate } from '../utils/finance';

function RecurringExpenses({ recurring = [] }) {
  if (recurring.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 text-center text-sm italic text-zinc-500">
        No recurring patterns detected yet. Repeated expenses will start showing up here with predicted upcoming dates.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recurring.map((item) => (
        <div
          key={`${item.normalized_description}-${item.estimated_next_date}`}
          className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-zinc-900/60"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <RefreshCw className="h-4 w-4 text-cyan-300" />
                {item.description}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                <span>{item.category}</span>
                <span className="rounded-full border border-white/10 px-2 py-1">
                  Every {item.frequency_days} days
                </span>
                <span className="rounded-full border border-white/10 px-2 py-1">
                  {item.occurrences} payments logged
                </span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-lg font-black text-white">{formatCurrency(item.average_amount)}</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                <Calendar className="h-3.5 w-3.5 text-cyan-300" />
                {item.is_overdue ? 'Expected' : 'Upcoming'} {formatLongDate(item.estimated_next_date)}
              </div>
            </div>
          </div>

          {(item.days_until <= 5 || item.is_overdue) && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200">
              <BellRing className="h-4 w-4" />
              {item.is_overdue ? 'This recurring expense may already be due.' : 'Upcoming payment is close. Plan for it.'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecurringExpenses;
