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
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers but keep content
    .replace(/###/g, '') // Remove heading markers
    .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
    .replace(/^[-•]\s/gm, '') // Remove bullet points
    .replace(/^Step \d+:/gm, (match) => `\n${match}`) // Add spacing before steps
    .replace(/([0-9]) \* ([0-9])/g, '$1 × $2') // Replace * with × for multiplication
    .trim();
}

// Add this function to parse graph data from Gemini's response
function extractGraphData(text: string) {
  const graphMatch = text.match(/\[GRAPH_DATA\]([\s\S]*?)\[\/GRAPH_DATA\]/);
  if (!graphMatch) return null;

  try {
    const parsedData = JSON.parse(graphMatch[1]);
    
    // Ensure the data has all required fields
    if (!parsedData.type || !parsedData.labels || !parsedData.datasets) {
      console.error('Missing required graph fields:', parsedData);
      return null;
    }

    // Add default values if missing
    return {
      type: parsedData.type,
      title: parsedData.title || 'Graph',
      labels: parsedData.labels,
      datasets: parsedData.datasets.map((dataset: any) => ({
        label: dataset.label || 'Data',
        data: dataset.data,
        borderColor: dataset.borderColor || 'rgb(75, 192, 192)',
        backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.5)'
      })),
      options: {
        xAxisLabel: parsedData.options?.xAxisLabel || '',
        yAxisLabel: parsedData.options?.yAxisLabel || '',
        showGrid: parsedData.options?.showGrid ?? true,
        startAtZero: parsedData.options?.startAtZero ?? true
      }
    };
  } catch (e) {
    console.error('Failed to parse graph data:', e);
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
    // 1. Session check
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Input validation
    const { text, subject, teachingStyle } = req.body;
    if (!text || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // 3. Generate response using Gemini
      let prompt = '';
      if (subject === 'math') {
        prompt = `You are a helpful math tutor. Use the following teaching style: ${teachingStyle || 'step-by-step'}.
        
        Student's question: ${text}

        IMPORTANT INSTRUCTIONS:
        1. First, provide the complete step-by-step solution with explanations.
        2. Then, if the question involves any visual elements, add the graph data at the END of your response.

        Your response should follow this structure:

        Problem Statement:
        [Write the problem statement here]

        Step-by-step Solution:
        1. [First step with explanation]
        2. [Second step with explanation]
        ...

        Final Answer:
        [State the final answer clearly]

        Concepts Used:
        [Brief explanation of the mathematical concepts used]

        [If the question involves any of these, ALWAYS add graph data AFTER the explanation:
        - Geometry (shapes, angles, triangles, circles, etc.)
        - Graphs of functions
        - Coordinate geometry
        - Data visualization
        - Statistical plots
        - Vector diagrams]

        Graph data format:
        [GRAPH_DATA]
        {
          "type": "line" | "scatter" | "bar" | "pie",
          "title": "Graph Title",
          "labels": ["x1", "x2", ...],
          "datasets": [{
            "label": "Dataset Name",
            "data": [y1, y2, ...],
            "borderColor": "rgb(75, 192, 192)",
            "backgroundColor": "rgba(75, 192, 192, 0.5)"
          }],
          "options": {
            "xAxisLabel": "X Axis Label",
            "yAxisLabel": "Y Axis Label",
            "showGrid": true,
            "startAtZero": true
          }
        }
        [/GRAPH_DATA]

        Guidelines for graph types:
        1. Use 'line' for:
           - Continuous functions (y = x², sin(x), etc.)
           - Trend lines
           - Time series data

        2. Use 'scatter' for:
           - Points in coordinate geometry
           - Data points without connecting lines
           - Plotting discrete points

        3. Use 'bar' for:
           - Comparing discrete quantities
           - Histograms
           - Frequency distributions

        4. Use 'pie' for:
           - Parts of a whole
           - Percentages
           - Proportions

        For geometry problems:
        - Use scatter plots to show points and shapes
        - Include enough points to clearly show the shape
        - Add labels for vertices and important points
        - Use multiple datasets to show different elements (e.g., one for the shape, another for auxiliary lines)

        REMEMBER: Always provide both the complete explanation AND the graph data for visual concepts.`;
      } else {
        prompt = `You are a helpful science tutor. Use the following teaching style: ${teachingStyle || 'step-by-step'}.
        
        Student's question: ${text}
        
        Please provide:
        1. A clear explanation of the concept
        2. Key definitions and terminology
        3. Real-world examples or applications
        4. Any relevant formulas or principles`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      // Extract graph data if present
      const graphData = extractGraphData(answer);
      
      // Clean the response and remove the graph data section
      const cleanedAnswer = cleanResponse(answer.replace(/\[GRAPH_DATA\][\s\S]*?\[\/GRAPH_DATA\]/, ''));
      const formattedAnswer = `${subject.toUpperCase()} Tutor\n\n${cleanedAnswer}\n\nNeed more help? Just ask!`;

      return res.status(200).json({
        text: formattedAnswer,
        graphData,
        questionsLeft: 20
      });

    } catch (aiError) {
      console.error('AI Error:', aiError);
      return res.status(500).json({ error: 'AI processing failed' });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
