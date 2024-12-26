import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const text = req.body.text || 'Test message';
    const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice ID

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate speech');
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    return res.status(200).json({ 
      success: true,
      audioUrl
    });
  } catch (error: any) {
    console.error('ElevenLabs API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to test ElevenLabs API',
      details: error.message 
    });
  }
}
