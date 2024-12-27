import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { processAIResponse } from '@/lib/aitutor/responseProcessor';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Helper function to clean response text
function cleanResponse(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/###/g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^[-•]\s/gm, '')
    .replace(/^Step \d+:/gm, (match) => `\n${match}`)
    .replace(/([0-9]) \* ([0-9])/g, '$1 × $2')
    .trim();
}

function extractGraphData(text: string) {
  const graphMatch = text.match(/\[GRAPH_DATA\]([\s\S]*?)\[\/GRAPH_DATA\]/);
  if (!graphMatch) return null;

  try {
    const parsedData = JSON.parse(graphMatch[1]);
    return parsedData.type ? parsedData : null;
  } catch (error) {
    console.error('Failed to parse graph data:', error);
    return null;
  }
}

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

    if (!text || !subject || !teachingStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get remaining questions
    let questionsLeft = 3; // Default value
    try {
      const tutorSession = await prisma.tutorSession.findFirst({
        where: {
          userId: session.user.id,
          questionsLeft: { gt: 0 }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (tutorSession) {
        questionsLeft = tutorSession.questionsLeft - 1;
      }
    } catch (dbError) {
      console.error('Database Error:', dbError);
    }

    const prompt = `You are an expert ${subject} tutor. A student has asked: "${text}"

    Format your response as a JSON object with these EXACT sections. Make sure to include ALL sections with proper content:

    {
      "steps": "1. First step explanation\n2. Second step explanation\n3. Third step explanation",
      
      "visual": {
        "type": "function",
        "data": {
          "function": "sin(x)",  // Use simple JavaScript notation (sin, cos, abs)
          "domain": [-10, 10],   // Specify appropriate domain
          "keyPoints": {
            "intercepts": [[0, 0]],  // Array of [x, y] points
            "maxima": [[1.5, 1]],    // Array of [x, y] points
            "minima": [[-1.5, -1]]   // Array of [x, y] points
          }
        }
      },
      
      "practice": {
        "problems": [
          {
            "question": "Here's a similar problem to practice with",
            "difficulty": "medium",
            "solution": "Step-by-step solution to the practice problem"
          }
        ]
      },
      
      "concepts": {
        "title": "Main Concept",
        "description": "Clear explanation of the main concept",
        "relatedTopics": [
          {
            "name": "Related Topic",
            "description": "How this topic connects to the main concept"
          }
        ]
      }
    }

    Important:
    1. ALL sections must have content - never return empty strings
    2. Steps must be numbered (1., 2., etc.)
    3. Visual must include function, domain, and keyPoints
    4. Practice must include question, difficulty, and solution
    5. Concepts must include title, description, and relatedTopics
    6. Return ONLY the JSON object, no other text`;

    console.log('Sending prompt to Gemini:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();
      
      console.log('=== Raw API Response ===');
      console.log(text_response);

      try {
        // Process the response using our responseProcessor
        const processedResponse = processAIResponse(text_response);
        console.log('=== Processed Response ===', JSON.stringify(processedResponse, null, 2));

        // Verify content before sending
        const { content } = processedResponse;
        console.log('=== Content Verification ===');
        console.log('Steps:', content.steps?.slice(0, 100));
        console.log('Practice:', content.practice?.slice(0, 100));
        console.log('Concepts:', content.concepts?.slice(0, 100));
        console.log('Visual:', content.visual);

        // Add default content if any section is empty
        const finalContent = {
          ...processedResponse,
          content: {
            steps: content.steps || 'Analyzing your question...',
            visual: content.visual,
            practice: content.practice || 'Preparing practice problems...',
            concepts: content.concepts || 'Loading concept explanations...'
          }
        };

        console.log('=== Final Response ===', JSON.stringify(finalContent, null, 2));
        return res.status(200).json(finalContent);
      } catch (error) {
        console.error('Error processing response:', error);
        return res.status(500).json({
          type: 'error',
          error: 'Failed to process response',
          content: {
            steps: 'Error processing response',
            visual: null,
            practice: 'No practice problems available',
            concepts: 'No concepts available'
          }
        });
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      return res.status(500).json({
        type: 'error',
        error: 'Failed to generate response',
        content: {
          steps: 'Error generating response',
          visual: null,
          practice: 'No practice problems available',
          concepts: 'No concepts available'
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
