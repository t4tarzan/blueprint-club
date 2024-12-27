import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { text, subject, teachingStyle } = req.body;

    if (!text || !subject || !teachingStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an AI ${subject} tutor. A student has asked: "${text}"
    Please explain the concept in a ${teachingStyle} manner.
    
    If the answer involves mathematical equations, use LaTeX notation.
    If the answer would benefit from a graph, include it in the following format:
    [GRAPH_DATA]
    {
      "type": "line|bar|scatter",
      "labels": ["x1", "x2", ...],
      "datasets": [{
        "label": "Dataset Label",
        "data": [y1, y2, ...],
        "borderColor": "rgb(75, 192, 192)",
        "backgroundColor": "rgba(75, 192, 192, 0.5)"
      }],
      "options": {
        "xAxisLabel": "X Axis",
        "yAxisLabel": "Y Axis"
      }
    }
    [/GRAPH_DATA]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text_response = response.text();

    // Extract any graph data if present
    const graphData = extractGraphData(text_response);
    
    // Remove the graph data from the text if it exists
    const cleanedText = text_response.replace(/\[GRAPH_DATA\][\s\S]*?\[\/GRAPH_DATA\]/g, '');
    
    const finalResponse = {
      text: cleanResponse(cleanedText),
      graphData: graphData
    };

    res.status(200).json(finalResponse);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}
