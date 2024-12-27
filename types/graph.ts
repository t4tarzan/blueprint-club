// Base props for all visual components
export interface BaseVisualProps {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  interactive?: boolean;
  onPointHover?: (point: Point | null) => void;
}

// Function graph specific types
export interface Point {
  x: number;
  y: number;
}

export interface Label {
  text: string;
  position: [number, number];
}

export interface Measurement {
  value: number;
  unit?: string;
  position: [number, number];
}

export interface GeometricShape {
  type: 'line' | 'polygon' | 'rectangle' | 'circle';
  points: [number, number][];
  color?: string;
  fillColor?: string;
  lineWidth?: number;
  labels?: Label[];
  measurements?: Measurement[];
}

export interface FunctionGraphData {
  type: 'function';
  function: string;
  domain?: [number, number];
  points: Point[];
  labels?: {
    x?: string;
    y?: string;
  };
  gridLines?: boolean;
  keyPoints?: {
    intercepts?: Point[];
    maxima?: Point[];
    minima?: Point[];
    inflection?: Point[];
  };
}

export interface GeometricData {
  type: 'geometric';
  shapes: GeometricShape[];
  gridLines?: boolean;
}

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DataGraphData {
  type: 'data';
  data: DataPoint[];
  title?: string;
  labels?: {
    x?: string;
    y?: string;
  };
}

export type VisualData = FunctionGraphData | GeometricData | DataGraphData;

// Props interface for the main visual component
export interface MathVisualProps extends BaseVisualProps {
  data: VisualData;
  onShapeClick?: (shape: GeometricShape) => void;
}
