import { AIResponse, WhiteboardContent } from '@/types/aitutor';

interface AIResponseSuccess {
  type: 'success';
  content: WhiteboardContent;
}

interface AIResponseError {
  type: 'error';
  error: string;
  content: WhiteboardContent;
}

type ProcessedResponse = AIResponseSuccess | AIResponseError;

export const processAIResponse = (response: any): ProcessedResponse => {
  try {
    // Parse response if it's a string
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    // Extract sections
    const {
      steps = '',
      visual,
      practice = '',
      concepts = '',
      questionsLeft = 0
    } = data;

    // Format the response
    const content: WhiteboardContent = {
      steps: typeof steps === 'string' ? steps : steps.steps || '',
      visual: visual?.Visual || visual,
      practice: typeof practice === 'string' ? practice : practice.Practice || '',
      concepts: typeof concepts === 'string' ? concepts : concepts.Concepts || ''
    };

    return {
      type: 'success',
      content
    };
  } catch (error) {
    console.error('Error processing AI response:', error);
    return {
      type: 'error',
      error: 'Failed to process AI response',
      content: {
        steps: 'Error processing response',
        visual: undefined,
        practice: 'No practice problems available',
        concepts: 'No concepts available'
      }
    };
  }
};
