import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ScatterController,
  ScatterDataPoint,
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  ArcElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface GraphDisplayProps {
  graphData: {
    type: 'line' | 'scatter' | 'bar' | 'pie';
    title: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[] | ScatterDataPoint[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
    options?: {
      xAxisLabel?: string;
      yAxisLabel?: string;
      showGrid?: boolean;
      startAtZero?: boolean;
    };
  };
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ graphData }) => {
  const chartRef = useRef<ChartJS | null>(null);

  const baseOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Kalam'
          }
        }
      },
      title: {
        display: true,
        text: graphData.title,
        font: {
          size: 16,
          family: 'Kalam'
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
    },
    scales: graphData.type !== 'pie' ? {
      y: {
        beginAtZero: graphData.options?.startAtZero ?? true,
        title: {
          display: !!graphData.options?.yAxisLabel,
          text: graphData.options?.yAxisLabel,
          font: {
            family: 'Kalam'
          }
        },
        grid: {
          display: graphData.options?.showGrid ?? true,
          drawBorder: true,
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 1
        },
        ticks: {
          font: {
            family: 'Kalam'
          }
        }
      },
      x: {
        title: {
          display: !!graphData.options?.xAxisLabel,
          text: graphData.options?.xAxisLabel,
          font: {
            family: 'Kalam'
          }
        },
        grid: {
          display: graphData.options?.showGrid ?? true,
          drawBorder: true,
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 1
        },
        ticks: {
          font: {
            family: 'Kalam'
          }
        }
      }
    } : undefined
  };

  // For scatter plots (geometry), ensure aspect ratio is maintained
  if (graphData.type === 'scatter') {
    baseOptions.aspectRatio = 1;
    baseOptions.scales = {
      ...baseOptions.scales,
      x: {
        ...baseOptions.scales?.x,
        min: Math.min(...graphData.datasets.flatMap(d => d.data.map((p: any) => p.x))) - 1,
        max: Math.max(...graphData.datasets.flatMap(d => d.data.map((p: any) => p.x))) + 1,
      },
      y: {
        ...baseOptions.scales?.y,
        min: Math.min(...graphData.datasets.flatMap(d => d.data.map((p: any) => p.y))) - 1,
        max: Math.max(...graphData.datasets.flatMap(d => d.data.map((p: any) => p.y))) + 1,
      }
    };
  }

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const data: ChartData = {
    labels: graphData.labels,
    datasets: graphData.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || 'rgb(75, 192, 192)',
      backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.5)',
      tension: 0.3
    }))
  };

  const renderChart = () => {
    switch (graphData.type) {
      case 'line':
        return <Line ref={chartRef} options={baseOptions} data={data} />;
      case 'bar':
        return <Bar ref={chartRef} options={baseOptions} data={data} />;
      case 'pie':
        return <Pie ref={chartRef} options={baseOptions} data={data} />;
      case 'scatter':
        return <Scatter ref={chartRef} options={baseOptions} data={data} />;
      default:
        return <Line ref={chartRef} options={baseOptions} data={data} />;
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-4 my-4 shadow-sm w-full h-[400px]">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={resetZoom}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reset Zoom
        </button>
      </div>
      {renderChart()}
    </div>
  );
};

export default GraphDisplay;
