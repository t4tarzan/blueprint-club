import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

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

    // Handle question count
    let questionsLeft = 20;
    if (session.user.email !== 'test@example.com') {
      try {
        // Get or create tutor session
        let tutorSession = await prisma.tutorSession.findFirst({
          where: {
            userId: session.user.id,
            questionsLeft: { gt: 0 }
          }
        });

        if (!tutorSession) {
          tutorSession = await prisma.tutorSession.create({
            data: {
              userId: session.user.id,
              questionsLeft: 20
            }
          });
        }

        // Update questions left
        await prisma.tutorSession.update({
          where: { id: tutorSession.id },
          data: { questionsLeft: tutorSession.questionsLeft - 1 }
        });

        questionsLeft = tutorSession.questionsLeft - 1;
      } catch (dbError) {
        console.error('Database Error:', dbError);
        // Continue with default questionsLeft value
      }
    }

    const prompt = `You are an expert ${subject} tutor. A student has asked: "${text}"

    Format your response as a JSON object with these EXACT sections:
    {
      "steps": "Provide a clear step-by-step solution here. Break down the explanation into numbered steps.",
      
      "visual": {
        "type": "function",
        "data": {
          "function": "sin(x)",  // Use simple JavaScript notation (sin, cos, abs)
          "domain": [-10, 10]    // Specify appropriate domain
        }
      },
      
      "practice": {
        "problems": [
          {
            "question": "A similar but different practice problem",
            "difficulty": "easy|medium|hard",
            "solution": "Step-by-step solution to the practice problem"
          }
        ]
      },
      
      "concepts": {
        "title": "Main concept or topic",
        "description": "Brief overview of the key concept",
        "relatedTopics": [
          {
            "name": "Related concept name",
            "description": "How this concept connects to the main topic"
          }
        ]
      }
    }

    Important Instructions:
    1. Return ONLY the JSON object above, no other text or markers
    2. For mathematical functions:
       - Use simple JavaScript notation (sin, cos, abs)
       - Do NOT include Math. prefix
       - Example: sin(2*x + 1) not Math.sin(2*x + 1)
    3. Keep explanations clear and concise
    4. Always include all sections
    5. For step-by-step explanations, use numbers (1., 2., etc.)
    6. Make sure the JSON is valid and properly formatted`;

    console.log('Sending prompt to Gemini:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();
      console.log('Raw Gemini response:', text_response); // Debug log

      try {
        // Parse the JSON response
        const jsonResponse = JSON.parse(text_response);
        console.log('Parsed response:', jsonResponse);

        // Extract the actual response from the JSON string in steps
        let parsedData = jsonResponse;
        if (typeof jsonResponse.steps === 'string' && jsonResponse.steps.includes('Here\'s what I understood:')) {
          try {
            const match = jsonResponse.steps.match(/```json\n([\s\S]*?)\n```/);
            if (match) {
              const innerJson = JSON.parse(match[1]);
              parsedData = {
                ...innerJson,
                questionsLeft
              };
            }
          } catch (innerParseError) {
            console.error('Failed to parse inner JSON:', innerParseError);
          }
        }

        return res.status(200).json(parsedData);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Raw text causing parse error:', text_response);
        // Fallback to text response if JSON parsing fails
        return res.status(200).json({
          steps: cleanResponse(text_response),
          visual: null,
          practice: '',
          concepts: '',
          questionsLeft
        });
      }
    } catch (aiError: any) {
      console.error('AI Generation Error:', aiError);
      console.error('Full error details:', aiError); // Debug log
      res.status(500).json({ 
        error: 'Failed to generate AI response',
        details: aiError.message,
        steps: 'Sorry, I had trouble understanding that. Could you rephrase your question?'
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
