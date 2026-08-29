import threading
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.ai_service import AIService
from app.services.speech import SpeechService
from app.services.voice_service import VoiceService

app = FastAPI(title="Echo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = AIService()
tts = SpeechService()
voice = VoiceService()

is_speaking = False

class ChatRequest(BaseModel):
    prompt: str

def speak_blocking(text: str):
    global is_speaking
    is_speaking = True
    try:
        tts.speak(text)
    finally:
        is_speaking = False


def speak_async(text: str):
    thread = threading.Thread(target=speak_blocking, args=(text,), daemon=True)
    thread.start()


@app.get("/")
def root():
    return {"status": "online", "message": "active"}


@app.post("/chat")
def chat(request: ChatRequest):
    global is_speaking

    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    while is_speaking:
        time.sleep(0.1)

    response = assistant.generate_response(request.prompt)
    print(f"Echo (text): {response}\n")

    speak_async(response)

    return {"user_prompt": request.prompt, "echo_response": response}


@app.get("/listen")
def listen_and_respond():
    global is_speaking

    while is_speaking:
        time.sleep(0.1)

    user_speech = voice.listen()

    if not user_speech:
        return {"user_spoken": "", "echo_response": ""}

    response = assistant.generate_response(user_speech)
    print(f"Echo (voice): {response}\n")

    speak_async(response)

    return {"user_spoken": user_speech, "echo_response": response}