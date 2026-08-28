import asyncio
import edge_tts
import pygame
import os

class SpeechService:
    def __init__(self):
        pygame.mixer.init()
        self.voice = "en-US-ChristopherNeural"
        self.audio_file = "temp_response.mp3"

    async def _generate_audio(self, text: str):
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(self.audio_file)

    def speak(self, text: str):
        try:
            # generate
            asyncio.run(self._generate_audio(text))

            # play
            pygame.mixer.music.load(self.audio_file)
            pygame.mixer.music.play()

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

            # unload
            pygame.mixer.music.unload()
            if os.path.exists(self.audio_file):
                os.remove(self.audio_file)

        except Exception as e:
            print(f"Error: {e}")