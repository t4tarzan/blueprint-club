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
  console.log('GraphDisplay received data:', data);

  // Generate points for the function
  const generatePoints = () => {
    try {
      const { function: fn, domain } = data.data;
      console.log('Generating points for function:', {
        function: fn,
        domain: domain
      });

      const [start, end] = domain;
      const points = [];
      const steps = 100;

      for (let i = 0; i <= steps; i++) {
        const x = start + (i / steps) * (end - start);
        try {
          // Use Function constructor to safely evaluate the function
          const fnEval = new Function('x', `return ${fn}`);
          const y = fnEval(x);
          if (!isNaN(y) && isFinite(y)) {
            points.push({ x, y });
          }
        } catch (error) {
          console.error('Error evaluating point:', { x, error });
        }
      }

      return points;
    } catch (error) {
      console.error('Error generating points:', error);
      return [];
    }
  };

  const points = generatePoints();
  console.log('Generated points:', points);

  const chartData = {
    labels: points.map(p => p.x.toFixed(1)),
    datasets: [
      {
        label: data.data.function,
        data: points.map(p => p.y),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        display: true,
        title: {
          display: true,
          text: 'x',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        title: {
          display: true,
          text: 'y',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `f(x) = ${data.data.function}`,
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GraphDisplay;
