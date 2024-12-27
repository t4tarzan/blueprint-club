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
    console.log('=== Processing AI Response ===');
    console.log('Raw response:', typeof response === 'string' ? response : JSON.stringify(response, null, 2));

    // Parse response if it's a string
    const data = typeof response === 'string' ? JSON.parse(response) : response;
    console.log('Parsed data:', JSON.stringify(data, null, 2));

    // Extract sections with detailed logging
    console.log('Extracting sections...');
    const {
      steps = '',
      visual = null,
      practice = '',
      concepts = '',
      questionsLeft = 0
    } = data;

    console.log('Extracted sections:');
    console.log('- steps:', steps);
    console.log('- visual:', visual);
    console.log('- practice:', practice);
    console.log('- concepts:', concepts);

    // Format the response with proper type handling
    const content: WhiteboardContent = {
      steps: typeof steps === 'string' ? steps : 
        typeof steps === 'object' ? JSON.stringify(steps) : '',
      
      visual: visual?.type === 'function' ? visual : undefined,
      
      practice: typeof practice === 'string' ? practice :
        typeof practice === 'object' && practice.problems ? 
          practice.problems.map((p: any) => 
            `Question: ${p.question}\nDifficulty: ${p.difficulty}\nSolution: ${p.solution}`
          ).join('\n\n') : '',
      
      concepts: typeof concepts === 'string' ? concepts :
        typeof concepts === 'object' ? 
          `${concepts.title || ''}\n\n${concepts.description || ''}\n\n${
            concepts.relatedTopics ? 
              'Related Topics:\n' + concepts.relatedTopics.map((t: any) => 
                `• ${t.name}: ${t.description}`
              ).join('\n') : ''
          }` : ''
    };

    console.log('=== Processed Content ===');
    console.log(JSON.stringify(content, null, 2));

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
