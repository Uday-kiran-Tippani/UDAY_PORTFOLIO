from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os

app = Flask(__name__)
CORS(app)

# 🔐 Gemini Client (ENV VARIABLE ONLY)
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY", "YOUR_API_KEY")
)

# 🔗 Social & Contact Links
SOCIAL_LINKS = {
    "instagram": "https://instagram.com/uday_kiran143us",
    "linkedin": "https://www.linkedin.com/in/udaykirantippani",
    "email": "mailto:udaykiran143us@gmail.com?subject=Portfolio%20Inquiry",
    "twitter": "https://x.com/UTippani25615",
    "x": "https://x.com/UTippani25615"
}

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

    # 🚀 QUICK ACTION HANDLING
    if "open" in user_lower:
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

        if "twitter" in user_lower or "x" in user_lower:
            return jsonify({
                "type": "action",
                "action": "open_url",
                "url": SOCIAL_LINKS["x"],
                "reply": "Opening X 🌍"
            })

    if any(word in user_lower for word in ["email", "contact", "mail", "gmail"]):
        return jsonify({
            "type": "action",
            "action": "open_url",
            "url": SOCIAL_LINKS["email"],
            "reply": "Opening email composer 📧"
        })

    # 🧠 AI SYSTEM PROMPT (STATIC & SAFE)
    system_prompt = f"""
You are an AI portfolio assistant for **Uday Kiran Tippani**.

ABOUT UDAY:
- Full Stack Python Developer
- MCA Student
- Freelancer (Developer & Graphic Designer)
- Founder of UDAY SOLUTIONS
- Skilled in Python, Flask, HTML, CSS, JavaScript, AI tools
- Has basic knowledge of Java
- His projects includes Automated attendace system using face recognition,qr code genrator,protfolio websites,some small websites like meal finder,tictactoe,password strength checker,weather app uisng open weather api,aadhar qr code decoder,etc..

RULES:
- Answer confidently and professionally
- Do NOT say you lack information
- Do NOT ask users for details
- Be concise and friendly

User Question:
{user_message}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=system_prompt
        )
        reply = response.text.strip()

    except Exception as e:
        print("Gemini Error:", e)

        if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
            reply = (
                "🚦 I’m currently handling many requests.\n\n"
                "Please try again in a few moments 🙂"
            )
        else:
            reply = "⚠️ Sorry, I’m having trouble answering right now."

    return jsonify({
        "type": "message",
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)

