import os
import speech_recognition as sr
from google.cloud import dialogflow
from gtts import gTTS
from playsound import playsound
import google.generativeai as genai
from dotenv import load_dotenv
import tempfile
import sympy
import matplotlib.pyplot as plt
import numpy as np
import re

# Load environment variables
load_dotenv()
print("Environment variables loaded")

# Configure Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')
print("Gemini configured")

class MathTutor:
    def __init__(self):
        print("Initializing Math Tutor...")
        self.recognizer = sr.Recognizer()
        self.project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
        print(f"Project ID: {self.project_id}")
        self.session_client = dialogflow.SessionsClient()
        self.session = self.session_client.session_path(self.project_id, "unique-session-id")
        self.context = []
        self.difficulty_level = "medium"
        print("Math Tutor initialized")

    def test_audio_output(self):
        """Test audio output with a simple message"""
        print("Testing audio output...")
        try:
            test_message = "Hello, this is a test message from Math Tutor."
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
                temp_filename = fp.name
                print(f"Created temporary file: {temp_filename}")
                
            tts = gTTS(text=test_message, lang='en')
            print("Generated speech")
            tts.save(temp_filename)
            print("Saved audio file")
            
            print("Playing audio...")
            playsound(temp_filename)
            print("Audio played")
            
            os.remove(temp_filename)
            print("Temporary file cleaned up")
            return True
        except Exception as e:
            print(f"Error in audio test: {e}")
            return False

    def test_microphone(self):
        """Test microphone input"""
        print("Testing microphone...")
        try:
            with sr.Microphone() as source:
                print("Microphone initialized")
                print("Adjusting for ambient noise...")
                self.recognizer.adjust_for_ambient_noise(source)
                print("Please say something...")
                audio = self.recognizer.listen(source, timeout=5)
                print("Audio captured")
                
            text = self.recognizer.recognize_google(audio)
            print(f"Recognized text: {text}")
            return True
        except sr.WaitTimeoutError:
            print("No speech detected within timeout")
            return False
        except Exception as e:
            print(f"Error in microphone test: {e}")
            return False

    def listen(self):
        """Listen to user's voice input"""
        print("Listening...")
        try:
            with sr.Microphone() as source:
                print("Microphone activated")
                self.recognizer.adjust_for_ambient_noise(source)
                print("Adjusted for ambient noise")
                audio = self.recognizer.listen(source)
                print("Audio captured")
            
            text = self.recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in listen(): {e}")
            return None

    def get_dialogflow_response(self, text):
        """Get response from Dialogflow for conversation flow"""
        print(f"Getting Dialogflow response for: {text}")
        text_input = dialogflow.TextInput(text=text, language_code="en-US")
        query_input = dialogflow.QueryInput(text=text_input)
        
        try:
            response = self.session_client.detect_intent(
                request={"session": self.session, "query_input": query_input}
            )
            print("Dialogflow response received")
            return response.query_result
        except Exception as e:
            print(f"Error with Dialogflow: {e}")
            return None

    def get_math_help(self, problem, context=None):
        """Get mathematical help from Gemini"""
        prompt = f"""You are a helpful math tutor. The student's difficulty level is {self.difficulty_level}.
        Previous context: {context if context else 'None'}
        
        Student's question: {problem}
        
        Provide a step-by-step explanation. If it's a calculation, show the work.
        If it's a concept, explain with examples. Include relevant formulas.
        Keep the explanation clear and encouraging."""

        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error with Gemini: {e}")
            return None

    def solve_equation(self, equation):
        """Solve mathematical equations using sympy"""
        try:
            # Clean the equation
            equation = equation.replace('solve', '').strip()
            x = sympy.Symbol('x')
            
            # Convert text equation to sympy expression
            expr = sympy.sympify(equation)
            solution = sympy.solve(expr, x)
            
            return f"The solution is: {solution}"
        except Exception as e:
            return f"I couldn't solve that equation. Error: {e}"

    def plot_function(self, function_str):
        """Plot mathematical functions"""
        try:
            x = np.linspace(-10, 10, 1000)
            # Convert string to numpy-compatible function
            y = eval(function_str.replace('^', '**'))
            
            plt.figure(figsize=(8, 6))
            plt.plot(x, y)
            plt.grid(True)
            plt.title(f"Plot of {function_str}")
            plt.xlabel('x')
            plt.ylabel('y')
            
            # Save plot to temp file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                plt.savefig(tmp.name)
                return tmp.name
        except Exception as e:
            return f"Couldn't plot the function. Error: {e}"

    def speak(self, text):
        """Convert text to speech and play it"""
        if not text:
            return
        
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
                temp_filename = fp.name
                
            tts = gTTS(text=text, lang='en')
            tts.save(temp_filename)
            playsound(temp_filename)
            os.remove(temp_filename)
        except Exception as e:
            print(f"Error in text-to-speech: {e}")

    def process_math_request(self, text):
        """Process different types of math requests"""
        if "solve" in text.lower():
            return self.solve_equation(text)
        elif "plot" in text.lower():
            return self.plot_function(text)
        else:
            return self.get_math_help(text, self.context)

    def run(self):
        """Main loop for the math tutor"""
        print("\nStarting Math Tutor...")
        print("Testing audio components...")
        
        print("\nTesting audio output...")
        if not self.test_audio_output():
            print("Audio output test failed!")
            return
        
        print("\nTesting microphone input...")
        if not self.test_microphone():
            print("Microphone test failed!")
            return
        
        print("\nAll tests passed! Starting main loop...")
        print("Math Tutor is ready! Ask your math questions...")
        
        while True:
            user_input = self.listen()
            
            if user_input:
                # Check intent with Dialogflow
                dialog_result = self.get_dialogflow_response(user_input)
                
                if dialog_result:
                    intent = dialog_result.intent.display_name
                    print(f"Detected intent: {intent}")
                    
                    if intent == "set_difficulty":
                        self.difficulty_level = dialog_result.parameters["difficulty"]
                        response = f"Difficulty level set to {self.difficulty_level}"
                    elif intent == "quit":
                        response = "Goodbye! Feel free to come back anytime you need help with math!"
                        self.speak(response)
                        break
                    else:
                        # Process math request
                        response = self.process_math_request(user_input)
                        
                        # Add to context for future reference
                        self.context.append({"question": user_input, "response": response})
                        if len(self.context) > 3:  # Keep only last 3 interactions
                            self.context.pop(0)
                
                print("Tutor:", response)
                self.speak(response)

if __name__ == "__main__":
    tutor = MathTutor()
    tutor.run()