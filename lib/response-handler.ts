import { WhiteboardContent } from '@/types/aitutor';

interface ParsedResponse {
  steps: string;
  visual?: {
    type: string;
    data: {
      function: string;
      domain: [number, number];
    };
  };
  practice?: {
    problems: Array<{
      question: string;
      difficulty?: string;
      solution: string;
    }>;
  };
  concepts?: {
    title: string;
    description: string;
    relatedTopics?: Array<{
      name: string;
      description: string;
    }>;
  };
}

export function extractJsonFromResponse(text: string): ParsedResponse | null {
  try {
    // Try to find JSON content between ```json and ``` markers
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // If no markers, try parsing the entire text as JSON
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse response:', error);
    return null;
  }
}

export function formatSteps(data: ParsedResponse | null): string {
  if (!data?.steps) return 'No steps available';
  return data.steps.trim();
}

export function formatVisual(data: ParsedResponse | null): any {
  if (!data?.visual?.type || !data?.visual?.data) {
    return {
      type: 'function',
      data: {
        function: 'x',
        domain: [-10, 10]
      }
    };
  }

  // Format mathematical functions for JavaScript
  const jsFunction = data.visual.data.function
    .replace(/sin/gi, 'Math.sin')
    .replace(/cos/gi, 'Math.cos')
    .replace(/tan/gi, 'Math.tan')
    .replace(/abs/gi, 'Math.abs')
    .replace(/\^/g, '**')
    .replace(/pi/gi, 'Math.PI');

  return {
    ...data.visual,
    data: {
      ...data.visual.data,
      function: jsFunction
    }
  };
}

export function formatPractice(data: ParsedResponse | null): string {
  if (!data?.practice?.problems?.length) return '';

  return data.practice.problems
    .map(p => {
      if (!p.question || !p.solution) return '';
      return [
        `Question: ${p.question}`,
        p.difficulty ? `Difficulty: ${p.difficulty}` : '',
        `Solution: ${p.solution}`
      ].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

export function formatConcepts(data: ParsedResponse | null): string {
  if (!data?.concepts) return '';

  const parts = [];
  
  if (data.concepts.title) {
    parts.push(data.concepts.title);
  }
  
  if (data.concepts.description) {
    parts.push(data.concepts.description);
  }

  if (data.concepts.relatedTopics?.length) {
    parts.push(
      'Related Topics:',
      ...data.concepts.relatedTopics
        .filter(t => t.name && t.description)
        .map(t => `• ${t.name}: ${t.description}`)
    );
  }

  return parts.join('\n\n');
}

export function processAIResponse(rawResponse: string, question: string): WhiteboardContent {
  console.log('Processing raw response:', rawResponse);
  
  const parsedData = extractJsonFromResponse(rawResponse);
  console.log('Parsed data:', parsedData);

  return {
    steps: `Your Question: ${question}\n\n${formatSteps(parsedData)}`,
    visual: formatVisual(parsedData),
    practice: formatPractice(parsedData),
    concepts: formatConcepts(parsedData)
  };
}
