import json
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

MODEL_NAME = "llama-3.3-70b-versatile"
ALLOWED_CATEGORIES = {
    "food",
    "rent",
    "transport",
    "subscriptions",
    "shopping",
    "utilities",
    "others",
}


def _build_client() -> Optional[Groq]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


client = _build_client()


def _chat_completion(
    *,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
    max_tokens: int = 300,
) -> Optional[str]:
    if client is None:
        return None

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=temperature,
            max_completion_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return None


def _fallback_category(text: str) -> str:
    normalized = (text or "").lower()
    keyword_map = {
        "food": ["food", "restaurant", "dinner", "lunch", "breakfast", "grocery", "groceries", "cafe", "coffee", "zomato", "swiggy"],
        "rent": ["rent", "lease", "landlord", "apartment", "housing"],
        "transport": ["uber", "ola", "lyft", "taxi", "metro", "bus", "train", "flight", "petrol", "gas", "fuel", "transport"],
        "subscriptions": ["subscription", "netflix", "spotify", "prime", "youtube", "membership", "saas", "plan"],
        "shopping": ["amazon", "flipkart", "mall", "shopping", "clothes", "shirt", "shoes", "electronics", "order"],
        "utilities": ["electric", "water", "wifi", "internet", "mobile bill", "phone bill", "utility", "recharge"],
    }

    for category, keywords in keyword_map.items():
        if any(keyword in normalized for keyword in keywords):
            return category
    return "others"


def categorize_expense(text: str) -> str:
    prompt = f"""
Categorize this expense into exactly one category:
food, rent, transport, subscriptions, shopping, utilities, others

Expense: {text}

Return only the category name in lowercase.
""".strip()

    response_text = _chat_completion(
        system_prompt="You classify expense descriptions into a fixed category list.",
        user_prompt=prompt,
        temperature=0,
        max_tokens=20,
    )

    if response_text:
        category = response_text.split()[0].strip().lower().strip(".,:;!\"'")
        if category in ALLOWED_CATEGORIES:
            return category

    return _fallback_category(text)


def generate_insight_summary(metrics: Dict[str, Any]) -> str:
    prompt = f"""
You are a finance assistant. Write one concise paragraph under 55 words using the provided metrics.
Mention the weekly or monthly movement, the top spending category, and the projected month-end spend.

Metrics:
{json.dumps(metrics, indent=2)}
""".strip()

    response_text = _chat_completion(
        system_prompt="Write crisp personal finance summaries with plain language and no markdown.",
        user_prompt=prompt,
        temperature=0.3,
        max_tokens=120,
    )

    if response_text:
        return response_text

    weekly_change = metrics.get("weekly_change_percent", 0)
    direction = "up" if weekly_change >= 0 else "down"
    return (
        f"Weekly spending is {direction} {abs(weekly_change):.0f}% versus last week, "
        f"with {metrics.get('top_category', 'Others')} leading your outflow. "
        f"At this pace, month-end spending may reach INR {metrics.get('prediction_amount', 0):.2f}."
    )


def answer_finance_chat(question: str, context: Dict[str, Any]) -> str:
    prompt = f"""
Answer the user's expense question using only the supplied JSON context. Be direct, helpful, and under 120 words.
If the exact answer is unavailable, say what is available instead of inventing details.

User question:
{question}

Context:
{json.dumps(context, indent=2)}
""".strip()

    response_text = _chat_completion(
        system_prompt="You are an expense tracking assistant grounded in the user's finance data.",
        user_prompt=prompt,
        temperature=0.2,
        max_tokens=220,
    )

    if response_text:
        return response_text

    weekly = context.get("weekly_summary", {})
    budget = context.get("budget", {})
    return (
        f"This week you logged {weekly.get('count', 0)} expenses totaling INR {weekly.get('total', 0):.2f}. "
        f"Your top category is {weekly.get('top_category', 'Others')}, "
        f"and your current monthly budget usage is {budget.get('utilization', 0):.0f}%."
    )
