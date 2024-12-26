import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const MALE_VOICE_ID = 'pNInz6obpgDQGcFmaJgB';  // Adam
const FEMALE_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    const { text, teacher = 'math' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text field' });
    }

    // Select voice based on teacher
    const voiceId = teacher === 'math' ? MALE_VOICE_ID : FEMALE_VOICE_ID;

    console.log('Generating voice with:', {
      voiceId,
      textLength: text.length,
      teacher
    });

    // Call Eleven Labs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY!,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Voice generation failed: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('Voice generated successfully');
    return res.status(200).json({ audioUrl });

  } catch (error) {
    console.error('Voice generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate voice response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
