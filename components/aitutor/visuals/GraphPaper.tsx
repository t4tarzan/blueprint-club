import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FunctionGraphData, Point, BaseVisualProps } from '@/types/graph';

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

interface GraphPaperProps extends BaseVisualProps {
  data: FunctionGraphData;
  onPointHover?: (point: Point | null) => void;
}

export const GraphPaper: React.FC<GraphPaperProps> = ({
  data,
  width = 600,
  height = 400,
  theme = 'light',
  interactive = true,
  onPointHover
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#F3F4F6' : '#1F2937';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  const chartData = {
    datasets: [{
      type: 'line' as const,
      label: data.function || 'Function',
      data: data.points,
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'nearest' as const
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: textColor
        }
      },
      title: {
        display: !!data.function,
        text: data.function || '',
        color: textColor
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'center' as const,
        title: {
          display: true,
          text: data.labels?.x || 'x',
          color: textColor
        },
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      },
      y: {
        type: 'linear' as const,
        position: 'center' as const,
        title: {
          display: true,
          text: data.labels?.y || 'y',
          color: textColor
        },
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      }
    }
  };

  return (
    <div
      style={{ width, height }}
      className={`relative rounded-lg p-4 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <Line data={chartData} options={options} />
    </div>
  );
};
