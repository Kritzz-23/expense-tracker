from __future__ import annotations

import calendar
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from statistics import mean
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple


def _expense_date(expense: Any) -> datetime:
    return expense.date if isinstance(expense.date, datetime) else datetime.utcnow()


def normalize_description(description: str) -> str:
    normalized = re.sub(r"[^a-z0-9\s]", " ", (description or "").lower())
    return re.sub(r"\s+", " ", normalized).strip()


def serialize_expense(expense: Any, recurring_descriptions: Optional[Set[str]] = None) -> Dict[str, Any]:
    recurring_descriptions = recurring_descriptions or set()
    normalized = normalize_description(expense.description)
    return {
        "id": expense.id,
        "description": expense.description,
        "amount": float(expense.amount),
        "category": expense.category,
        "date": _expense_date(expense).isoformat(),
        "is_recurring": normalized in recurring_descriptions,
    }


def _window_total(expenses: Iterable[Any], start: datetime, end: datetime) -> float:
    total = 0.0
    for expense in expenses:
        expense_date = _expense_date(expense)
        if start <= expense_date <= end:
            total += float(expense.amount)
    return round(total, 2)


def category_totals(expenses: Iterable[Any]) -> Dict[str, float]:
    totals: Dict[str, float] = defaultdict(float)
    for expense in expenses:
        totals[(expense.category or "others").lower()] += float(expense.amount)
    return dict(sorted(totals.items(), key=lambda item: item[1], reverse=True))


def current_month_expenses(expenses: Iterable[Any], now: Optional[datetime] = None) -> List[Any]:
    now = now or datetime.utcnow()
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return [expense for expense in expenses if _expense_date(expense) >= start]


def build_budget_status(
    expenses: Iterable[Any], monthly_limit: Optional[float], now: Optional[datetime] = None
) -> Dict[str, Any]:
    now = now or datetime.utcnow()
    month_expenses = current_month_expenses(expenses, now)
    spent_this_month = round(sum(float(expense.amount) for expense in month_expenses), 2)
    utilization = 0.0
    remaining = None
    status = "not_set"

    if monthly_limit and monthly_limit > 0:
        utilization = round((spent_this_month / monthly_limit) * 100, 2)
        remaining = round(monthly_limit - spent_this_month, 2)
        if utilization >= 100:
            status = "exceeded"
        elif utilization >= 80:
            status = "near_limit"
        else:
            status = "healthy"

    return {
        "monthly_limit": round(monthly_limit, 2) if monthly_limit is not None else None,
        "spent_this_month": spent_this_month,
        "remaining": remaining,
        "utilization": utilization,
        "status": status,
        "month_label": now.strftime("%B %Y"),
    }


def _build_daily_series(expenses: Iterable[Any], days: int, now: datetime) -> List[Dict[str, Any]]:
    daily_totals: Dict[str, float] = defaultdict(float)
    start = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    for expense in expenses:
        expense_date = _expense_date(expense)
        if expense_date >= start:
            key = expense_date.strftime("%Y-%m-%d")
            daily_totals[key] += float(expense.amount)

    series = []
    for offset in range(days):
        point_date = start + timedelta(days=offset)
        key = point_date.strftime("%Y-%m-%d")
        series.append(
            {
                "label": point_date.strftime("%d %b"),
                "amount": round(daily_totals.get(key, 0.0), 2),
            }
        )
    return series


def _start_of_week(value: datetime) -> datetime:
    return (value - timedelta(days=value.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)


def _build_weekly_series(expenses: Iterable[Any], weeks: int, now: datetime) -> List[Dict[str, Any]]:
    this_week_start = _start_of_week(now)
    first_week_start = this_week_start - timedelta(weeks=weeks - 1)
    weekly_totals: Dict[str, float] = defaultdict(float)

    for expense in expenses:
        expense_date = _expense_date(expense)
        week_start = _start_of_week(expense_date)
        if week_start >= first_week_start:
            key = week_start.strftime("%Y-%m-%d")
            weekly_totals[key] += float(expense.amount)

    series = []
    for offset in range(weeks):
        point_date = first_week_start + timedelta(weeks=offset)
        key = point_date.strftime("%Y-%m-%d")
        series.append(
            {
                "label": f"Week {offset + 1}",
                "amount": round(weekly_totals.get(key, 0.0), 2),
                "period_start": point_date.strftime("%d %b"),
            }
        )
    return series


def build_analytics(
    expenses: Iterable[Any], 
    range_name: str = "weekly", 
    now: Optional[datetime] = None,
    manual_start: Optional[datetime] = None,
    manual_end: Optional[datetime] = None
) -> Dict[str, Any]:
    now = now or datetime.utcnow()
    range_name = (range_name or "weekly").lower()

    if range_name == "manual" and manual_start and manual_end:
        days_diff = (manual_end - manual_start).days
        if days_diff > 45:
            weeks = max(1, days_diff // 7)
            trend = _build_weekly_series(expenses, weeks=weeks, now=manual_end)
        else:
            days = max(1, days_diff)
            trend = _build_daily_series(expenses, days=days, now=manual_end)
        cutoff = manual_start

        current_start = manual_start
        previous_duration = manual_end - manual_start
        previous_start = current_start - previous_duration
        previous_end = current_start - timedelta(seconds=1)
        current_total = _window_total(expenses, current_start, manual_end)
        previous_total = _window_total(expenses, previous_start, previous_end)

    elif range_name == "monthly":
        trend = _build_weekly_series(expenses, weeks=6, now=now)
        cutoff = _start_of_week(now) - timedelta(weeks=5)
        current_start = _start_of_week(now)
        previous_start = current_start - timedelta(weeks=1)
        current_total = _window_total(expenses, current_start, now)
        previous_total = _window_total(expenses, previous_start, current_start - timedelta(seconds=1))
    else:
        range_name = "weekly"
        trend = _build_daily_series(expenses, days=7, now=now)
        cutoff = (now - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
        current_start = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=6)
        previous_start = current_start - timedelta(days=7)
        previous_end = current_start - timedelta(seconds=1)
        current_total = _window_total(expenses, current_start, now)
        previous_total = _window_total(expenses, previous_start, previous_end)

    relevant_expenses = [expense for expense in expenses if _expense_date(expense) >= cutoff]
    categories = [
        {"category": category.title(), "amount": amount}
        for category, amount in category_totals(relevant_expenses).items()
    ]
    total = round(sum(point["amount"] for point in trend), 2)
    average = round(total / len(trend), 2) if trend else 0.0

    change_percent = percentage_change(current_total, previous_total)

    return {
        "range": range_name,
        "trend": trend,
        "categories": categories[:6],
        "total": total,
        "average": average,
        "comparison_total": round(previous_total, 2),
        "change_percent": change_percent,
    }


def percentage_change(current_value: float, previous_value: float) -> float:
    if previous_value == 0:
        return 100.0 if current_value > 0 else 0.0
    return round(((current_value - previous_value) / previous_value) * 100, 2)


def _project_month_end_total(expenses: Iterable[Any], now: datetime) -> float:
    month_expenses = current_month_expenses(expenses, now)
    spent_this_month = sum(float(expense.amount) for expense in month_expenses)
    days_elapsed = max(now.day, 1)
    days_in_month = calendar.monthrange(now.year, now.month)[1]
    projected = (spent_this_month / days_elapsed) * days_in_month if spent_this_month else 0.0
    return round(projected, 2)


def build_insight_metrics(expenses: Iterable[Any], now: Optional[datetime] = None) -> Dict[str, Any]:
    now = now or datetime.utcnow()
    expenses = list(expenses)

    week_start = (now - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
    previous_week_start = week_start - timedelta(days=7)
    previous_week_end = week_start - timedelta(seconds=1)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    previous_month_end = month_start - timedelta(seconds=1)
    previous_month_start = previous_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    weekly_total = _window_total(expenses, week_start, now)
    previous_week_total = _window_total(expenses, previous_week_start, previous_week_end)
    monthly_total = _window_total(expenses, month_start, now)
    previous_month_total = _window_total(expenses, previous_month_start, previous_month_end)

    month_category_totals = category_totals([expense for expense in expenses if _expense_date(expense) >= month_start])
    overall_category_totals = category_totals(expenses)
    top_category = next(iter(month_category_totals), next(iter(overall_category_totals), "others"))
    top_category_amount = month_category_totals.get(top_category, overall_category_totals.get(top_category, 0.0))

    prediction_amount = _project_month_end_total(expenses, now)

    recurring_items = detect_recurring_expenses(expenses, now=now)
    recurring_count = len(recurring_items)

    return {
        "weekly_total": weekly_total,
        "previous_week_total": previous_week_total,
        "monthly_total": monthly_total,
        "previous_month_total": previous_month_total,
        "weekly_change_percent": percentage_change(weekly_total, previous_week_total),
        "monthly_change_percent": percentage_change(monthly_total, previous_month_total),
        "top_category": top_category.title(),
        "top_category_amount": round(top_category_amount, 2),
        "prediction_amount": prediction_amount,
        "category_totals": {key.title(): value for key, value in overall_category_totals.items()},
        "recurring_count": recurring_count,
    }


def detect_recurring_expenses(expenses: Iterable[Any], now: Optional[datetime] = None) -> List[Dict[str, Any]]:
    now = now or datetime.utcnow()
    grouped: Dict[str, List[Any]] = defaultdict(list)

    for expense in expenses:
        normalized = normalize_description(expense.description)
        if normalized:
            grouped[normalized].append(expense)

    recurring_items: List[Dict[str, Any]] = []

    for normalized, items in grouped.items():
        if len(items) < 2:
            continue

        ordered_items = sorted(items, key=_expense_date)
        intervals = []
        for previous, current in zip(ordered_items, ordered_items[1:]):
            days = (_expense_date(current) - _expense_date(previous)).days
            if days > 0:
                intervals.append(days)

        if not intervals:
            continue

        average_interval = round(mean(intervals))
        if average_interval < 5 or average_interval > 60:
            continue

        amounts = [float(item.amount) for item in ordered_items]
        average_amount = round(mean(amounts), 2)
        amount_spread = max(amounts) - min(amounts)
        if average_amount and (amount_spread / average_amount) > 0.6:
            continue

        categories = Counter((item.category or "others").title() for item in ordered_items)
        last_seen = _expense_date(ordered_items[-1])
        estimated_next = last_seen + timedelta(days=average_interval)
        recurring_items.append(
            {
                "description": ordered_items[-1].description,
                "normalized_description": normalized,
                "average_amount": average_amount,
                "last_amount": round(float(ordered_items[-1].amount), 2),
                "category": categories.most_common(1)[0][0],
                "occurrences": len(ordered_items),
                "frequency_days": average_interval,
                "estimated_next_date": estimated_next.date().isoformat(),
                "days_until": (estimated_next.date() - now.date()).days,
                "is_overdue": estimated_next.date() < now.date(),
            }
        )

    recurring_items.sort(key=lambda item: (item["days_until"], item["description"].lower()))
    return recurring_items[:6]


def recurring_description_set(expenses: Iterable[Any], now: Optional[datetime] = None) -> Set[str]:
    return {item["normalized_description"] for item in detect_recurring_expenses(expenses, now=now)}


def weekly_summary(expenses: Iterable[Any], now: Optional[datetime] = None) -> Dict[str, Any]:
    now = now or datetime.utcnow()
    start = (now - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
    current_week_expenses = [expense for expense in expenses if _expense_date(expense) >= start]
    totals = category_totals(current_week_expenses)
    top_category = next(iter(totals), "Others").title()
    total = round(sum(float(expense.amount) for expense in current_week_expenses), 2)
    return {
        "total": total,
        "count": len(current_week_expenses),
        "top_category": top_category,
    }


def build_chat_context(expenses: Iterable[Any], monthly_limit: Optional[float], now: Optional[datetime] = None) -> Dict[str, Any]:
    now = now or datetime.utcnow()
    expenses = list(expenses)
    insights = build_insight_metrics(expenses, now=now)
    budget = build_budget_status(expenses, monthly_limit=monthly_limit, now=now)
    recent_expenses = sorted(expenses, key=_expense_date, reverse=True)[:8]
    recurring = detect_recurring_expenses(expenses, now=now)

    return {
        "insights": insights,
        "budget": budget,
        "recent_expenses": [serialize_expense(expense) for expense in recent_expenses],
        "recurring": recurring,
        "weekly_summary": weekly_summary(expenses, now=now),
    }

