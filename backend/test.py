import os
from google import genai
# form google.genai import types # verify import if needed

# 1. Replace with your NEW API key
# Best practice: client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
client = genai.Client(api_key="AIzaSyDALHkbqn-yoLgphyRWUjoha-jM2EpmveQ") 

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",  # Changed from "gemini-1.5-flash-001"
        contents="Say hello like a friendly AI assistant"
    )
    print(response.text)

except Exception as e:
    print(f"An error occurred: {e}")