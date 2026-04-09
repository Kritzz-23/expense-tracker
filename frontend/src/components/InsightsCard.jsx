import React from 'react';
import { Sparkles, Target, TrendingUp, Wallet } from 'lucide-react';

function InsightStat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-outline">
        <Icon className={`h-4 w-4 ${accent}`} />
        {label}
      </div>
      <div className="text-lg font-black text-on-surface">{value}</div>
    </div>
  );
}

function InsightsCard({ insights }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-inner">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
          <Sparkles className="h-4 w-4" />
          AI Insight Summary
        </div>
        <p className="text-sm leading-7 text-on-surface-variant">{insights?.summary || 'Insights will appear once you log more spending data.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 2xl:grid-cols-3 md:grid-cols-2">
        <InsightStat
          icon={Target}
          label="Top Category"
          value={insights?.top_category || 'No data'}
          accent="text-secondary"
        />
        <InsightStat
          icon={TrendingUp}
          label="Weekly Change"
          value={insights?.increase_percent || '0.00%'}
          accent="text-primary-container"
        />
        <InsightStat
          icon={Wallet}
          label="Prediction"
          value={insights?.prediction || 'INR 0.00'}
          accent="text-primary"
        />
      </div>
    </div>
  );
}

export default InsightsCard;
