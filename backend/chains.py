import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def categorize_expense(text: str) -> str:
    prompt = f"""
    Categorize this expense into one category ONLY:
    food, rent, transport, subscriptions, shopping, utilities, others

    Expense: {text}

    Return only the category name.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content.strip().lower()