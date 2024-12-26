import speech_recognition as sr
import time

def test_mic():
    print("Testing microphone...")
    r = sr.Recognizer()
    
    # Make it more sensitive
    r.energy_threshold = 300  # Lower threshold for detecting speech
    r.dynamic_energy_threshold = True
    r.pause_threshold = 0.8  # Shorter pause before considering the phrase complete
    
    try:
        with sr.Microphone() as source:
            print("\nMicrophone initialized")
            print("Adjusting for ambient noise... (3 seconds)")
            r.adjust_for_ambient_noise(source, duration=3)
            print(f"Energy threshold set to {r.energy_threshold}")
            print("\n=== Please speak something (speak clearly and a bit louder) ===")
            
            # Listen for input
            audio = r.listen(source, timeout=10, phrase_time_limit=5)
            print("Audio captured, processing...")
            
            # Try recognizing with more detailed error reporting
            try:
                text = r.recognize_google(audio)
                print(f"\nYou said: {text}")
            except sr.UnknownValueError:
                print("Speech was detected but could not be understood")
                print("Try speaking more clearly and a bit louder")
            
    except sr.WaitTimeoutError:
        print("No speech detected - timeout")
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=== Microphone Test ===")
    print("Make sure your microphone is connected and permissions are granted")
    test_mic()
