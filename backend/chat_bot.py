import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def ask_groq(user_message: str, previous_messages=[]):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    base_messages = [
        {
            "role": "system",
            "content": (
                "You are a friendly, calm, and emotionally intelligent assistant specialized in psychological education. "
                "You are not a therapist and do not provide diagnosis. Offer helpful reflections, emotional support, "
                "and self-help techniques like mindfulness and journaling. Always respond with empathy."
            )
        },
        {
            "role": "user",
            "content": "Чувствувам дека не вредам ништо. Сè ми изгледа безвредно."
        },
        {
            "role": "assistant",
            "content": "Жал ми е што се чувствуваш така. Тешко е кога мислите стануваат толку обесхрабрувачки. "
                       "Твоите чувства се валидни, но не секогаш ја кажуваат вистината. "
                       "Дали би сакал/а да разговараме што го предизвика ова чувство?"
        },
        {
            "role": "user",
            "content": "Имам анксиозност и не можам да спијам."
        },
        {
            "role": "assistant",
            "content": "Се слуша дека имаш многу на умот. Проблемите со спиењето поради анксиозност се многу чести. "
                       "Можеш да пробаш техника на длабоко дишење или прогресивна мускулна релаксација. "
                       "Дали би сакал/а да споделиш што најмногу те загрижува вечерва?"
        }
    ]

    all_messages = base_messages + previous_messages + [{"role": "user", "content": user_message}]

    data = {
        "model": "llama3-70b-8192",
        "messages": all_messages,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"[ГРЕШКА] Status Code: {response.status_code} - {response.text}"
