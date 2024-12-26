import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from 'next';

// Add this helper function to clean the response
function cleanResponse(text: string): string {
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/###/g, '') // Remove heading markers
    .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
    .replace(/^Step \d+:/gm, (match) => `\n${match}`) // Add spacing before steps
    .trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'Google API key is not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = req.body.prompt || 'Test prompt';
    
    // Enhanced prompt to get structured output
    const enhancedPrompt = `
      You are a math tutor. Please solve this problem step by step in a clear format.
      Keep your explanation concise and focused on the solution steps.
      
      Format your response exactly like this:
      Step 1: [First step explanation]
      Step 2: [Second step explanation]
      Step 3: [Third step explanation if needed]
      Final answer: [The answer]
      
      Problem: ${prompt}
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated');
    }

    // Clean the response before sending
    const cleanedText = cleanResponse(text);
    
    return res.status(200).json({ 
      success: true, 
      data: cleanedText 
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to test Gemini API',
      details: error.message || 'Unknown error occurred'
    });
  }
}
