# this is only for testing purposes/ if you only wanna test it in the powershell or smth

import sys
from services.ai_service import AIService
from services.speech import SpeechService
from services.voice_service import VoiceService

def main():
    print("Speak into your mic or type 'exit' to end the session.\n")

    assistant = AIService()
    tts = SpeechService()
    voice = VoiceService()

    while True:
        try:
            # listen
            user_input = voice.listen()

            if not user_input:
                continue

            if user_input.lower() in ["exit", "quit", "goodbye"]:
                print("Echo: Bye!")
                tts.speak("Goodbye!")
                break

            response = assistant.generate_response(user_input)
            print(f"Echo: {response}\n")
            
            # speak the audio
            tts.speak(response)

        except KeyboardInterrupt:
            print("\nEcho: Bye!")
            sys.exit(0)

if __name__ == "__main__":
    main()