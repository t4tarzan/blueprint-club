import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, TeachingStyle, VisualData, Point, WhiteboardContent } from '@/types/aitutor';

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

const defaultVisual = {
  type: 'function' as const,
  data: {
    function: 'x',
    domain: [-10, 10] as [number, number]
  }
};

export async function handleGeminiRequest(request: GeminiRequest): Promise<AIResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON once
    let parsedContent;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        parsedContent = JSON.parse(text);
      }
    } catch (error) {
      console.error('Failed to parse response:', error);
      return {
        type: 'error',
        content: {
          steps: 'Error processing response',
          visual: defaultVisual,
          practice: { problems: [] },
          concepts: { title: '', description: '', relatedTopics: [] }
        }
      };
    }

    return {
      type: 'success',
      content: {
        steps: parsedContent.steps || 'No steps available',
        visual: parsedContent.visual || defaultVisual,
        practice: parsedContent.practice || { problems: [] },
        concepts: parsedContent.concepts || { title: '', description: '', relatedTopics: [] }
      }
    };
  } catch (error) {
    console.error('Error in Gemini request:', error);
    return {
      type: 'error',
      content: {
        steps: 'Error generating response',
        visual: defaultVisual,
        practice: { problems: [] },
        concepts: { title: '', description: '', relatedTopics: [] }
      }
    };
  }
}
