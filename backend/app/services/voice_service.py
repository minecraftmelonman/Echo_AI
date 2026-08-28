import speech_recognition as sr
from typing import Any, cast

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 1.2
        self.recognizer.non_speaking_duration = 1

    def listen(self) -> str:
        with sr.Microphone() as source:
            print("\nPlease speak")

            self.recognizer.adjust_for_ambient_noise(source, duration=0.3)
            
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=50)
                print("Processing..")

                text = cast(Any, self.recognizer).recognize_google(audio)
                print(f"You: {text}")
                return text

            except sr.WaitTimeoutError:
                print("Im sorry, please try again.")
                return ""
            except sr.UnknownValueError:
                print("Im sorry, I dont understand.")
                return ""
            except sr.RequestError as e:
                print(f"Error: {e}")
                return ""