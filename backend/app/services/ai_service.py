import os
from dotenv import load_dotenv, find_dotenv
from groq import Groq
from groq.types.chat import ChatCompletionMessageParam

load_dotenv(find_dotenv())

class AIService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.system_message: ChatCompletionMessageParam = {
            "role": "system",
            "content": "You are Echo, a helpful, fast voice assistant. Keep answers brief (1-2 sentences) unless asked for details."
        }
        self.history: list[ChatCompletionMessageParam] = [self.system_message]

    def generate_response(self, prompt: str) -> str:
        try:
            self.history.append({"role": "user", "content": prompt})

            max_context = 10 # 5 ai messages + 5 user messages
            if len(self.history) > max_context + 1:
                self.history = [self.system_message] + self.history[-max_context:]

            response = self.client.chat.completions.create(
                messages=self.history,
                model="openai/gpt-oss-20b"
            )
            
            ai_reply = response.choices[0].message.content or "Sorry, I couldn't generate a response."

            self.history.append({"role": "assistant", "content": ai_reply})

            return ai_reply

        except Exception as e:
            return f"Error connecting to AI service: {e}"

    def reset_history(self):
        self.history = [self.system_message]