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

export const handleGeminiRequest = async (request: GeminiRequest): Promise<AIResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    // Map each section to its corresponding ContentSection type
    const sectionMap: Record<keyof WhiteboardContent, any> = {
      steps: response.steps,
      visual: response.visual,
      practice: response.practice,
      concepts: response.concepts
    };

    const content: WhiteboardContent = {
      // 'steps' section
      steps: typeof sectionMap.steps === 'string' ? sectionMap.steps : '',

      // 'visual' section
      visual: sectionMap.visual?.type === 'function' ? sectionMap.visual : undefined,

      // 'practice' section
      practice: sectionMap.practice?.problems ? 
        sectionMap.practice.problems.map((p: any) => 
          `Question: ${p.question}\n` +
          `Difficulty: ${p.difficulty}\n` +
          (p.hint ? `Hint: ${p.hint}\n` : '') +
          `Solution: ${p.solution}`
        ).join('\n\n') : '',

      // 'concepts' section
      concepts: sectionMap.concepts ? 
        `${sectionMap.concepts.title}\n\n` +
        `${sectionMap.concepts.description}\n\n` +
        'Related Topics:\n' +
        sectionMap.concepts.relatedTopics.map((t: any) => 
          `• ${t.name}: ${t.description}`
        ).join('\n') +
        '\n\nExamples:\n' +
        sectionMap.concepts.examples.map((e: any) => 
          `Problem: ${e.problem}\nSolution: ${e.solution}`
        ).join('\n\n') : ''
    };

    // Validate that each section exists and has content
    const validSections = Object.entries(content).reduce((acc, [key, value]) => {
      if (key === 'visual') {
        acc[key] = !!value;
      } else {
        acc[key] = typeof value === 'string' && value.trim().length > 0;
      }
      return acc;
    }, {} as Record<keyof WhiteboardContent, boolean>);

    if (!Object.values(validSections).some(v => v)) {
      throw new Error('No valid content sections found in response');
    }

    return {
      type: 'success',
      content
    };
  } catch (error) {
    console.error('Error handling Gemini request:', error);
    return {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      content: {
        steps: 'Error processing response',
        visual: undefined,
        practice: '',
        concepts: ''
      }
    };
  }
};
