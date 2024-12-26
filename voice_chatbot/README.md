# Voice-based Chatbot with Dialogflow and Gemini

An interactive voice chatbot that combines Google's Dialogflow for intent recognition and Gemini AI for advanced conversation capabilities. The chatbot can understand voice input, process it, and respond with synthesized speech.

## Features

- Voice input recognition
- Natural language processing with Dialogflow
- Advanced AI responses with Gemini
- Text-to-speech output
- Fallback mechanism between Dialogflow and Gemini

## Prerequisites

- Python 3.8 or higher
- Google Cloud account
- Dialogflow project
- Gemini API access
- Microphone for voice input
- Speakers for audio output

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd voice_chatbot
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and credentials:
	 - `GOOGLE_API_KEY`: Your Google API key for Gemini
	 - `DIALOGFLOW_PROJECT_ID`: Your Dialogflow project ID
	 - `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account JSON file

## Configuration

1. Dialogflow Setup:
   - Create a project in Dialogflow
   - Set up intents for common conversations
   - Download service account JSON
   - Set the path in GOOGLE_APPLICATION_CREDENTIALS

2. Gemini Setup:
   - Get API key from Google AI Studio
   - Add it to the .env file

## Usage

1. Run the chatbot:
   ```bash
   python main.py
   ```

2. Start speaking when you see "Listening..." in the console

3. The chatbot will:
   - Convert your speech to text
   - Process it through Dialogflow for intent matching
   - Use Gemini for complex queries
   - Respond with synthesized speech

## How it Works

1. **Voice Input**: Uses SpeechRecognition library with Google's speech-to-text
2. **Intent Processing**: 
   - First attempts to match intents using Dialogflow
   - Falls back to Gemini for more complex or unmatched queries
3. **Response Generation**: 
   - Uses matched intent response from Dialogflow or
   - Generates response using Gemini AI
4. **Voice Output**: Converts response to speech using gTTS

## Troubleshooting

- Ensure microphone permissions are granted
- Check if all API keys are correctly set in .env
- Verify Google Cloud service account has necessary permissions
- Make sure audio output device is working

## Dependencies

- google-cloud-dialogflow
- google-generativeai
- SpeechRecognition
- pyaudio
- python-dotenv
- google-cloud-speech
- gTTS
- playsound

## License
