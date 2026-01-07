from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from bs4 import BeautifulSoup
import os

app = Flask(__name__)
CORS(app)

# 🔐 Gemini Client (USE ENV VARIABLE IN PRODUCTION)
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY","YOUR_API_KEY")
)

# 🔗 Social & Contact Links (Single Source of Truth)
SOCIAL_LINKS = {
    "instagram": "https://instagram.com/uday_kiran143us",
    "linkedin": "https://www.linkedin.com/in/udaykirantippani",
    "email": "mailto:udaykiran143us@gmail.com?subject=Portfolio%20Inquiry",
    "twitter" : "https://x.com/UTippani25615",
    "x" : "https://x.com/UTippani25615"
}

# 📖 Read Portfolio HTML Content Automatically
def read_portfolio_context():
    files = [
        "frontend/index.html"
    ]

    content = ""
    for file in files:
        try:
            with open(file, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                text = soup.get_text(separator=" ", strip=True)
                content += text + "\n\n"
        except Exception as e:
            print(f"Skipping {file}: {e}")

    return content[:12000]  # safe prompt limit


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({
            "type": "message",
            "reply": "Please ask something about Uday 🙂"
        })

    user_lower = user_message.lower()

    # 🚀 ACTION HANDLING (Frontend will execute)
    if "open" in user_lower :
        if "instagram" in user_lower:
            return jsonify({
                "type": "action",
                "action": "open_url",
                "url": SOCIAL_LINKS["instagram"],
                "reply": "Opening Uday’s Instagram profile 📸"
            })

        if "linkedin" in user_lower:
            return jsonify({
                "type": "action",
                "action": "open_url",
                "url": SOCIAL_LINKS["linkedin"],
                "reply": "Opening Uday’s LinkedIn profile 💼"
            })
        
        if "twitter" in user_lower or "x" in user_lower :
            return jsonify({
                "type" : "action",
                "action" : "open_url",
                "url" : SOCIAL_LINKS["x"],
                "reply" : "Opening X...🌍"
            })

    if "email" in user_lower or "contact" in user_lower or "mail" in user_lower or "gmail" in user_lower:
        return jsonify({
            "type": "action",
            "action": "open_url",
            "url": SOCIAL_LINKS["email"],
            "reply": "Opening email composer 📧"
        })
    # 🧠 AI RESPONSE
    portfolio_context = read_portfolio_context()

    system_prompt = f"""
You are an AI portfolio assistant for **Uday Kiran Tippani**.

IMPORTANT RULES:
- You already HAVE full access to Uday's portfolio content below.
- NEVER say you don’t have information.
- NEVER ask the user to provide details.
- Answer confidently and naturally like a real AI assistant.
- If a detail is not explicitly mentioned, infer carefully but DO NOT hallucinate.
- If something is truly unknown, respond politely with available facts.

Who is Uday:
- Full Stack Python Developer
- MCA Student
- Freelance Developer & Graphic Designer
- Founder of UDAY SOLUTIONS
- Skills include Python, Flask, HTML, CSS, JavaScript, AI tools, and design
- Has basic knowledge of Java and other programming fundamentals

PORTFOLIO CONTENT (source of truth):
{portfolio_context}

User Question:
{user_message}

Answer clearly, professionally, and confidently.
"""


    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=system_prompt
        )
        reply = response.text.strip()
    except Exception as e:
        error_msg = str(e)

        if "RESOURCE_EXHAUSTED" in error_msg or "429" in error_msg:
            reply = (
                "🚦 I'm currently receiving too many requests.\n\n"
                "Please try again in a few moments 🙂"
            )
        else:
            reply = "⚠️ I’m having trouble answering right now."

        print("Gemini Error:", e)


    return jsonify({
        "type": "message",
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)
