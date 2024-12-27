import React from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { DataGraphData, BaseVisualProps } from '@/types/graph';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DataVisualizerProps extends BaseVisualProps {
  data: DataGraphData;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  data,
  width = 600,
  height = 400,
  theme = 'light',
  interactive = true
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#F3F4F6' : '#1F2937';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  const chartData = {
    labels: data.data.map(d => d.label),
    datasets: [
      {
        label: data.title || 'Data',
        data: data.data.map(d => d.value),
        backgroundColor: data.data.map(d => d.color || '#4F46E5'),
        borderColor: isDark ? '#F3F4F6' : '#1F2937',
        borderWidth: 1
      }
    ]
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
        display: !!data.title,
        text: data.title || '',
        color: textColor
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: data.labels?.x || '',
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
        title: {
          display: true,
          text: data.labels?.y || '',
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
      <Bar data={chartData} options={options} />
    </div>
  );
};
