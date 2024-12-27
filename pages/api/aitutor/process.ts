import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { WhiteboardContent } from '@/types/aitutor';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const defaultVisual = {
  type: 'function' as const,
  data: {
    function: 'x',
    domain: [-10, 10] as [number, number]
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email || !session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid session' });
    }

    const { text, subject, teachingStyle } = req.body;

    // Get remaining questions
    let questionsLeft = 3; // Default value
    let tutorSession;
    try {
      tutorSession = await prisma.tutorSession.findFirst({
        where: {
          userId: session.user.id,
          questionsLeft: { gt: 0 }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (tutorSession) {
        questionsLeft = tutorSession.questionsLeft;
      } else {
        // Create new session if none exists
        tutorSession = await prisma.tutorSession.create({
          data: {
            userId: session.user.id,
            questionsLeft: 3,
          }
        });
        questionsLeft = 3;
      }
    } catch (error) {
      console.error('Database Error:', error);
      // Continue with default questionsLeft value
    }

    // Generate the prompt
    const prompt = `You are an expert ${subject} tutor. Please help with this question: "${text}"

    Provide your response in these sections, using these EXACT section markers:

    [STEPS]
    Provide step-by-step explanation here. Number each step.
    [/STEPS]

    [VISUAL]
    {
      "type": "function",
      "data": {
        "function": "Math.sin(2 * x) + 1",
        "domain": [-10, 10],
        "keyPoints": {
          "intercepts": [[0, 1]],
          "maxima": [[1.57, 2]],
          "minima": [[-1.57, 0]]
        }
      }
    }
    [/VISUAL]

    [PRACTICE]
    {
      "problems": [
        {
          "question": "Write your practice question here",
          "difficulty": "medium",
          "solution": "Write the solution here"
        }
      ]
    }
    [/PRACTICE]

    [CONCEPTS]
    {
      "title": "Write the main concept title",
      "description": "Write the main concept explanation",
      "relatedTopics": [
        {
          "name": "Related topic name",
          "description": "Related topic explanation"
        }
      ]
    }
    [/CONCEPTS]`;

    console.log('Sending prompt to Gemini:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('=== Raw Gemini Response ===');
      console.log('Response text:', text);

      // Extract each section
      const extractSection = (section: string) => {
        const regex = new RegExp(`\\[${section}\\]([\\s\\S]*?)\\[\\/${section}\\]`);
        const match = text.match(regex);
        return match ? match[1].trim() : '';
      };

      // Parse JSON with better error handling
      const parseJSON = (jsonStr: string) => {
        try {
          // Clean the JSON string
          const cleaned = jsonStr
            .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
            .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
            .replace(/(?<!\\)'/g, '"')  // Replace unescaped single quotes
            .replace(/\n/g, ' ')        // Remove newlines
            .trim();
          return JSON.parse(cleaned);
        } catch (e) {
          console.error('JSON Parse error:', e);
          return null;
        }
      };

      // Extract each section
      const steps = extractSection('STEPS');
      const visualJson = extractSection('VISUAL');
      const practiceJson = extractSection('PRACTICE');
      const conceptsJson = extractSection('CONCEPTS');

      console.log('=== Extracted Sections ===');
      console.log('Steps:', steps);
      console.log('Visual JSON:', visualJson);
      console.log('Practice JSON:', practiceJson);
      console.log('Concepts JSON:', conceptsJson);

      // Parse JSON sections
      const visual = parseJSON(visualJson);
      const practice = parseJSON(practiceJson);
      const concepts = parseJSON(conceptsJson);

      // Validate we have at least some content
      if (!steps || !visual || !practice || !concepts) {
        console.error('Missing required sections');
        return res.status(200).json({
          type: 'error',
          error: 'Failed to extract all required sections',
          content: {
            steps: 'Error: Missing some content sections. Please try again.',
            visual: defaultVisual,
            practice: { problems: [] },
            concepts: { title: '', description: '', relatedTopics: [] }
          }
        });
      }

      // Return the structured content
      return res.status(200).json({
        type: 'success',
        content: {
          steps,
          visual: visual || defaultVisual,
          practice: practice || { problems: [] },
          concepts: concepts || { title: '', description: '', relatedTopics: [] }
        },
        questionsLeft: tutorSession?.questionsLeft ?? questionsLeft
      });

    } catch (error) {
      console.error('Failed to process response:', error);
      return res.status(200).json({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        content: {
          steps: 'Error: Failed to process response. Please try again.',
          visual: defaultVisual,
          practice: { problems: [] },
          concepts: { title: '', description: '', relatedTopics: [] }
        }
      });
    }
  } catch (error: any) {
    console.error('General API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}
