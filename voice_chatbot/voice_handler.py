from elevenlabs import Client, VoiceSettings
import os
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VoiceHandler:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv('ELEVEN_LABS_API_KEY')
        self.voice_id = os.getenv('ELEVEN_LABS_VOICE_ID')
        
        if not self.api_key:
            logger.warning("No Eleven Labs API key found. Voice generation will fail.")
            return
            
        self.client = Client(api_key=self.api_key)
        
        # Default voice settings for a teacher
        self.voice_settings = VoiceSettings(
            stability=0.71,  # Slightly higher stability for clearer speech
            similarity_boost=0.5,  # Balanced similarity
            style=0.0,  # Neutral style
            use_speaker_boost=True  # Enhanced clarity
        )

    def generate_speech(self, text):
        """Generate speech from text using Eleven Labs"""
        try:
            if not self.api_key:
                raise ValueError("No Eleven Labs API key configured")

            # If no custom voice_id, use 'Rachel' - a clear, professional voice
            voice_id = self.voice_id or "21m00Tcm4TlvDq8ikWAM"

            # Generate audio with enhanced speaking style for math
            audio = self.client.generate(
                text=text,
                voice_id=voice_id,
                model_id="eleven_monolingual_v1",
                voice_settings=self.voice_settings
            )
            
            return audio

        except Exception as e:
            logger.error(f"Error generating speech: {e}")
            return None

    def create_training_data(self, text_samples):
        """
        Create training data for fine-tuning the voice
        text_samples: List of strings containing math explanations
        """
        try:
            # Generate samples 
            for text in text_samples:
                self.generate_speech(text)
            
            logger.info(f"Generated {len(text_samples)} training samples")
            return True
            
        except Exception as e:
            logger.error(f"Error creating training data: {e}")
            return False

    @staticmethod
    def get_training_samples():
        """Get sample texts for training a math tutor voice"""
        return [
            "Let me explain how to solve this equation step by step.",
            "That's a great question! Let's break it down together.",
            "Don't worry if you don't get it right away. Math takes practice.",
            "The derivative of x squared is 2x. Let me explain why.",
            "Think about it this way: when we add these numbers...",
            "Excellent work! You're understanding the concept well.",
            "Let's try another example to make sure you've got it.",
            "Remember, in algebra, we can solve for x by isolating it on one side.",
            "This is a common mistake, but here's how we can fix it.",
            "Visualize the problem: imagine you have a graph..."
        ]
