from services.ai_service import AIService

def main():
    print("Echo AI Assistant")
    print("Use 'exit' to end the session.\n")

    assistant = AIService()

    while True:
        try:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() in "exit":
                print("Echo: Bye!")
                break

            response = assistant.generate_response(user_input)
            print(f"Echo: {response}\n")

        except KeyboardInterrupt:
            print("\nEcho: Bye!")
            break

if __name__ == "__main__":
    main()