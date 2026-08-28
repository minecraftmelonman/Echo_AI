import os
from dotenv import load_dotenv, find_dotenv
from groq import Groq

load_dotenv(find_dotenv())

class AIService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def generate_response(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are Echo, a helpful, fast voice assistant. Keep answers brief (1-2 sentences) unless asked for details."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="openai/gpt-oss-20b"
            )
            return response.choices[0].message.content or "Sorry, I couldn't generate a response."
        except Exception as e:
            return f"Error connecting to AI service: {e}"