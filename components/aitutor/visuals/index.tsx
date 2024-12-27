import React from 'react';
import { VisualData, Point } from '@/types/graph';
import { GraphPaper } from './GraphPaper';
import { GeometricCanvas } from './GeometricCanvas';
import { DataVisualizer } from './DataVisualizer';

interface MathVisualProps {
  data: VisualData;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  interactive?: boolean;
  onPointHover?: (point: Point | null) => void;
}

export const MathVisual: React.FC<MathVisualProps> = ({
  data,
  width,
  height,
  theme,
  interactive,
  onPointHover
}) => {
  switch (data.type) {
    case 'function':
      return (
        <GraphPaper
          data={data}
          width={width}
          height={height}
          theme={theme}
          interactive={interactive}
          onPointHover={onPointHover}
        />
      );
    case 'geometric':
      return (
        <GeometricCanvas
          data={data}
          width={width}
          height={height}
          theme={theme}
          interactive={interactive}
        />
      );
    case 'data':
      return (
        <DataVisualizer
          data={data}
          width={width}
          height={height}
          theme={theme}
          interactive={interactive}
        />
      );
    default:
      return <div>Unsupported visual type</div>;
  }
};
