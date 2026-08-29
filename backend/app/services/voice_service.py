import io
import os
import speech_recognition as sr
from groq import Groq

class VoiceService:
  def __init__(self):
    self.recognizer = sr.Recognizer()
    self.recognizer.energy_threshold = 200
    self.recognizer.dynamic_energy_threshold = True
    self.recognizer.pause_threshold = 1.0
    self.recognizer.non_speaking_duration = 0.5

    # env
    self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    with sr.Microphone() as source:
      print("Calibrating ambient noise...")
      self.recognizer.adjust_for_ambient_noise(source, duration=0.5)

  def listen(self) -> str:
    with sr.Microphone() as source:
      print("\nPlease speak")

      try:
        audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=30)
        print("Processing with Whisper...")

        wav_data = audio.get_wav_data()
        audio_file = ("speech.wav", io.BytesIO(wav_data), "audio/wav")

        # supa fast groq model
        transcription = self.client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            response_format="text",
            temperature=0.2,
            prompt=(
                "Literal transcription of natural spoken dialogue in English."
                "Transcribe all words exactly as spoken without summarizing."
            ),
        )

        text = str(transcription).strip()
        print(f"You: {text}")
        return text

      except sr.WaitTimeoutError:
        print("Listening timed out.")
        return ""
      except Exception as e:
        print(f"Error: {e}")
        return ""