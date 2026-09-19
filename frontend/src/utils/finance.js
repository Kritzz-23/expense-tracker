export function formatCurrency(value) {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatShortDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

export function formatLongDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function titleCase(value = '') {
  return value
    .toString()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function getBudgetMeta(status) {
  switch (status) {
    case 'exceeded':
      return {
        label: 'Budget exceeded',
        tone: 'text-red-700 border-red-200 bg-red-50',
        progressClass: 'bg-gradient-to-r from-red-500 to-orange-400',
      };
    case 'near_limit':
      return {
        label: 'Approaching budget limit',
        tone: 'text-amber-800 border-amber-200 bg-amber-50',
        progressClass: 'bg-gradient-to-r from-amber-400 to-orange-400',
      };
    case 'healthy':
      return {
        label: 'Budget on track',
        tone: 'text-emerald-700 border-emerald-200 bg-emerald-50',
        progressClass: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
      };
    default:
      return {
        label: 'Set a monthly budget',
        tone: 'text-on-surface-variant border-outline-variant/30 bg-surface-container-low',
        progressClass: 'bg-gradient-to-r from-blue-500 to-purple-500',
      };
  }
}

export function isSameDay(value, compareDate = new Date()) {
  if (!value) return false;
  return new Date(value).toDateString() === compareDate.toDateString();
}

export function getWeekKey(value = new Date()) {
  const date = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}
