
# Echo AI
![Static Badge](https://img.shields.io/badge/coverage-95%25-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
## About

**Echo AI** is a real-time, voice-enabled AI assistant web application that delivers low-latency conversational audio experiences. It captures natural voice input from the browser, transcribes and processes responses at ultra-high speeds using Groq API, and generates life-like text-to-speech audio streams.

## Demo

Insert gif or link to demo


## Who It's For

* **Developers & AI Enthusiasts:** Looking for an open-source template to integrate continuous voice input and text-to-speech backends into Next.js applications.
* **Accessibility Users:** Individuals who prefer hands-free, continuous spoken interactions over traditional text-based AI chats.
## Tech Stack

**Client:** Next.js, React, TypeScript, Tailwind CSS, pnpm/npm

**Server:** Python, FastAPI, Uvicorn, edge-tts, Groq API
## Features

- Voice mode/text mode
- TTS AI responses
- Working chatbot interface
- Locally hosted website
- Groq AI integration


## Requirements

 - [Python (3.10 or higher)](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [pnpm/npm](https://github.com/matiassingers/awesome-readme)
 - [Node.js](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Installation

#### Windows (***Easy installation***)
- Extract the ZIP file, then create a new file named .env on the root folder
- Copy the contents in .env.template and paste it into your .env file
- Go to the [Groq Console](https://console.groq.com), click **API keys**, then click the `Create API Key` button.
- Copy your new API key (*don't lose it*, since Groq only shows it once!) and paste it on your `.env` file (**GROQ_API_KEY**).
- Look in the ZIP file again, then look for a file named "**EchoRunner**" (**.bat/Windows Batch File**, make *sure* it does not end with *.sh/Shell Script!*)
- Double click the file and allow the file to run.
- The website *should* open automatically, but if it does not, please open http://localhost:3000/ on your web browser.
- Wait for a few seconds for the website to fully load, and you're done!

#### Linux/MacOS (***Easy installation***) (***UNFINISHED***)
- **Please note:** Sadly, I do not have an Apple laptop (I only have Windows & Linux computers) to test these instructions on, so if you do have one, kindly update this section!
- Download the ZIP file
- Add your .env file (template is called .env.template)
- Open the .sh file (not the .bat file)
- It should work and open http://localhost:3000/ on your web browser.


#### Windows/Linux/MacOS (***Normal installation***)
- If you are using **VS Code**, clone this repo using `git clone https://github.com/minecraftmelonman/Echo_AI.git`.
- In the **project root**, create a new file named `.env` and copy the contents from `.env.template` to your *new* file. 
- Go to the [Groq Console](https://console.groq.com), click **API keys**, then click the `Create API Key` button.
- Copy your new API key (*don't lose it*, since Groq only shows it once!) and paste it on your `.env` file (**GROQ_API_KEY**)
- After that, run these commands **one by one** in the project root: (**EXCEPT** for the *comments*)
```PowerShell
  # Start the website
  pnpm dev:frontend

  # Run on a seperate terminal (FOR WINDOWS)
  $env:PYTHONPATH="backend"
  uvicorn backend.app.main:app --reload --port 8000
  # For MacOS/Linux users, use this:
  export PYTHONPATH=backend
  uvicorn backend.app.main:app --reload --port 8000
```
    
## Roadmap

- MacOS Testing (I do not have a Mac, so I need someone to test it!)
- Clean up/replace the website
- Add option to use ollama instead of Groq


## Contributing

- Contributions are always welcome!
- Feel free to contribute in any way possible, or submit a *pull request*!

