import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FunctionGraphData } from '@/types/aitutor';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphDisplayProps {
  data: FunctionGraphData;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ data }) => {
  console.log(' GraphDisplay received data:', data);

  // Generate points for the function
  const generatePoints = () => {
    try {
      const { function: fn, domain } = data.data;
      console.log(' Generating points for function:', {
        function: fn,
        domain: domain
      });

      const [start, end] = domain;
      const points = [];
      const steps = 100;

      console.log('Evaluating function:', fn); // Debug log

      for (let i = 0; i <= steps; i++) {
        const x = start + (i / steps) * (end - start);
        try {
          // Use Function constructor to safely evaluate the function
          const evalFn = new Function('x', `return ${fn}`);
          const y = evalFn(x);
          
          // Skip points that are not finite numbers
          if (!Number.isFinite(y)) {
            console.log(' Skipping non-finite point:', { x, y });
            continue;
          }
          
          points.push({ x, y });
        } catch (error) {
          console.error(' Error evaluating point:', { x, error });
          continue;
        }
      }

      console.log(' Generated points:', {
        count: points.length,
        first: points[0],
        last: points[points.length - 1]
      });
      return points;
    } catch (error) {
      console.error(' Error generating points:', error);
      return [];
    }
  };

  const points = generatePoints();

  // Don't render if no valid points
  if (points.length === 0) {
    console.log(' No valid points to display');
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Unable to display graph</p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: 'Function',
        data: points,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        position: 'center' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        position: 'center' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GraphDisplay;
