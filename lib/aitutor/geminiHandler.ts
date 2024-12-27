import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, TeachingStyle, VisualData, Point, WhiteboardContent } from '@/types/aitutor';
import { processAIResponse } from './responseProcessor';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeminiRequest {
  question: string;
  teachingStyle: TeachingStyle;
  subject: 'math' | 'science';
}

const generatePrompt = (request: GeminiRequest): string => {
  const { question, teachingStyle, subject } = request;

  // Base prompt structure
  let prompt = `You are an expert ${subject} tutor. A student has asked: "${question}"\n\n`;

  // Add teaching style specific instructions
  switch (teachingStyle) {
    case 'step-by-step':
      prompt += 'Break down the solution into clear, sequential steps. ';
      break;
    case 'quick-response':
      prompt += 'Provide a concise explanation with key points. ';
      break;
    case 'interactive':
      prompt += 'Use real-world examples and applications. ';
      break;
  }

  // Response format instructions
  prompt += `
    Format your response as a JSON object with these EXACT sections:
    {
      "steps": "Provide a clear step-by-step solution here. Break down the explanation into numbered steps. Use markdown for formatting.",
      
      "visual": {
        "type": "function",
        "data": {
          "function": "The mathematical function in JavaScript notation (e.g., 'Math.sin(x)')",
          "domain": [-10, 10],
          "keyPoints": {
            "intercepts": [[x1, y1], [x2, y2]],
            "maxima": [[x, y]],
            "minima": [[x, y]]
          }
        }
      },
      
      "practice": {
        "problems": [
          {
            "question": "A similar but different practice problem",
            "difficulty": "easy|medium|hard",
            "hint": "Optional hint for the student",
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
        ],
        "examples": [
          {
            "problem": "Example problem showing the concept",
            "solution": "Solution demonstrating the concept"
          }
        ]
      }
    }

    Important:
    1. Keep the EXACT same structure for each section
    2. For math expressions, use LaTeX format inside $$ markers
    3. For the visual section, ensure the function is in valid JavaScript notation
    4. Break down steps into clear numbered points
    5. Include at least one practice problem
    6. Link the concepts to the main topic`;

  return prompt;
};

export const handleGeminiRequest = async (request: GeminiRequest): Promise<AIResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('=== Raw Gemini Response ===');
    console.log(text);

    // Process the response
    const processedResponse = processAIResponse(text);
    
    console.log('=== Processed Response ===');
    console.log(JSON.stringify(processedResponse, null, 2));

    return processedResponse;
  } catch (error) {
    console.error('Gemini Request Error:', error);
    return {
      type: 'error',
      error: 'Failed to process request',
      content: {
        steps: 'Error processing request',
        visual: undefined,
        practice: 'No practice problems available',
        concepts: 'No concepts available'
      }
    };
  }
};
