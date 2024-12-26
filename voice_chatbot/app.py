from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
from google.cloud import dialogflow
import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)

class MathTutor:
    def __init__(self):
        self.project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
        self.session_client = dialogflow.SessionsClient()
        self.session = self.session_client.session_path(self.project_id, "unique-session-id")
        self.context = []
        self.difficulty_level = "medium"

    def get_dialogflow_response(self, text):
        """Get response from Dialogflow for conversation flow"""
        text_input = dialogflow.TextInput(text=text, language_code="en-US")
        query_input = dialogflow.QueryInput(text=text_input)
        
        try:
            response = self.session_client.detect_intent(
                request={"session": self.session, "query_input": query_input}
            )
            return response.query_result
        except Exception as e:
            logger.error(f"Error with Dialogflow: {e}")
            return None

    def get_math_help(self, problem, context=None):
        """Get mathematical help from Gemini"""
        prompt = f"""You are a friendly math tutor. Explain in simple, spoken language.
        Question: {problem}
        Rules: 
        - Use natural speech (say "squared" not "^2")
        - Keep it brief and clear
        - Avoid special characters"""

        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error with Gemini: {e}")
            if "resource_exhausted" in str(e):
                return "I'm currently handling too many requests. Please try again in a moment."
            return "I'm having trouble processing your request. Could you try again?"

    def process_request(self, text):
        """Process the user's request and return appropriate response"""
        if not text:
            return "I couldn't understand that. Could you please repeat?"

        logger.info(f"Processing request: {text}")

        # Check intent with Dialogflow
        dialog_result = self.get_dialogflow_response(text)
        
        if dialog_result:
            intent = dialog_result.intent.display_name
            logger.info(f"Detected intent: {intent}")
            
            if intent == "set_difficulty":
                self.difficulty_level = dialog_result.parameters["difficulty"]
                return f"Difficulty level set to {self.difficulty_level}"
            elif intent == "quit":
                return "Goodbye! Feel free to come back anytime you need help with math!"
            
        # Get math help for the question
        response = self.get_math_help(text, self.context)
        
        # Add to context for future reference
        self.context.append({"question": text, "response": response})
        if len(self.context) > 3:  # Keep only last 3 interactions
            self.context.pop(0)
            
        return response

# Create a single instance of MathTutor
tutor = MathTutor()

@app.route('/')
def home():
    api_key = os.getenv('ELEVEN_LABS_API_KEY')
    return render_template('index.html', api_key=api_key)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    try:
        logger.info("Processing voice input")
        data = request.json
        
        if not data or 'text' not in data:
            logger.error("No text in request")
            return jsonify({'error': 'No text received'}), 400
        
        user_message = data['text']
        logger.info(f"Received text: {user_message}")
        
        # Get response from tutor
        response = tutor.process_request(user_message)
        logger.info(f"Tutor response: {response}")

        return jsonify({
            'user_message': user_message,
            'response': response
        })
            
    except Exception as e:
        logger.error(f"Error in process_audio: {e}")
        return jsonify({'error': f'Server error: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
