import { NextApiRequest, NextApiResponse } from 'next';
import { Voice, VoiceSettings } from 'elevenlabs-node';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// Voice IDs for our teachers
const TEACHER_VOICES = {
  math: 'pNInz6obpgDQGcFmaJgB', // Adam voice for Mr. David
  science: 'EXAVITQu4vr4xnSDxMaL', // Rachel voice for Ms. Sarah
};

// Voice settings for natural speech
const VOICE_SETTINGS: VoiceSettings = {
  stability: 0.71,
  similarity_boost: 0.5,
  style: 0,
  use_speaker_boost: true,
};

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

    const { text, teacher } = req.body;

    if (!text || !teacher || !['math', 'science'].includes(teacher)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Get user's current session
    const userSession = await prisma.tutorSession.findFirst({
      where: {
        userId: session.user.id,
        questionsLeft: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!userSession) {
      return res.status(403).json({ error: 'No active session found' });
    }

    // Initialize ElevenLabs
    const voice = new Voice({
      apiKey: process.env.ELEVEN_LABS_API_KEY!,
      voiceId: TEACHER_VOICES[teacher as keyof typeof TEACHER_VOICES],
    });

    // Generate speech
    const audioStream = await voice.textToSpeech(text, VOICE_SETTINGS);

    // Set appropriate headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Stream the audio data
    res.send(Buffer.from(audioStream));
  } catch (error) {
    console.error('Speech generation error:', error);
    res.status(500).json({ error: 'Error generating speech' });
  }
}
