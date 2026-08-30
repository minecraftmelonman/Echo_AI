import json
import threading
import time
from typing import List, Optional
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

class MessageItem(BaseModel):
    role: str
    content: Optional[str] = ""

class ChatRequest(BaseModel):
    prompt: Optional[str] = None
    messages: Optional[List[MessageItem]] = None

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

# localhost:3000/chat
@app.post("/chat")
def chat(request: ChatRequest):
    global is_speaking

    prompt_text = request.prompt
    if not prompt_text and request.messages:
        prompt_text = request.messages[-1].content

    if not prompt_text or not prompt_text.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    while is_speaking:
        time.sleep(0.1)

    response = assistant.generate_response(prompt_text)
    print(f"Echo (text): {response}\n")

    speak_async(response)

    return {"response": response}

is_listening_active = False

# localhost:3000/listen
@app.get("/listen")
def listen_and_respond():
    global is_speaking, is_listening_active

    while is_speaking:
        time.sleep(0.1)

    is_listening_active = True

    user_speech = voice.listen()

    if not is_listening_active:
        return {"user_spoken": "", "echo_response": "", "status": "cancelled"}

    if not user_speech:
        return {"user_spoken": "", "echo_response": ""}

    response = assistant.generate_response(user_speech)
    print(f"Echo (voice): {response}\n")

    speak_async(response)

    return {"user_spoken": user_speech, "echo_response": response}

# localhost:3000/stop-listen
@app.post("/stop-listen")
def stop_listen():
    global is_listening_active
    is_listening_active = False
    return {"status": "stopped"}

# localhost:3000/status
@app.get("/status")
def get_status():
    global is_speaking
    return {"is_speaking": is_speaking}