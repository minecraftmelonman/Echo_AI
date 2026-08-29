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

    # check if mic is already calibrated
    self.is_calibrated = False
    self.is_listening = False

    # env
    self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

  def stop_listening(self):
    self.is_listening = False

  def listen(self) -> str:
    self.is_listening = True

    with sr.Microphone() as source:

      # only calibrate once
      if not self.is_calibrated:
        self.is_calibrated = True
        print("Calibrating ambient noise...")
        self.recognizer.adjust_for_ambient_noise(source, duration=0.5)

      if not self.is_listening:
        print("Stopped listening")

      print("\nPlease speak")

      try:
        audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=30)

        if not self.is_listening:
          print("Mic button was turned off")
          return ""
        
        print("Processing with Whisper...")

        wav_data = audio.get_wav_data()
        audio_file = ("speech.wav", io.BytesIO(wav_data), "audio/wav")

        # supa fast groq model
        transcription = self.client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            response_format="text",
            temperature=0.0,
            prompt=(
                "Literal transcription of natural spoken dialogue in English."
                "Transcribe all words exactly as spoken without summarizing."
            ),
        )

        text = str(transcription).strip()

        # for some reason it keeps thinking im saying thank you??? if you are experiencing smth similar just add it to the table
        hallucinations = [
            "thank you.",
            "thank you",
            "thanks for watching.",
            "."
        ]

        if text.lower() in hallucinations:
            print("Listening hallucinated")
            return ""

        print(f"You: {text}")
        return text

      except sr.WaitTimeoutError:
        print("Listening timed out.")
        return ""
      except Exception as e:
        print(f"Error: {e}")
        return ""