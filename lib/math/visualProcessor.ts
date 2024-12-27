import { evaluate } from 'mathjs';
import { Point, VisualData, FunctionGraphData, GeometricData, DataGraphData } from '@/types/graph';

const generatePoints = (fn: string, domain: [number, number] = [-10, 10]): Point[] => {
  const points: Point[] = [];
  const [start, end] = domain;
  const step = (end - start) / 200; // 200 points for smooth curve

  for (let x = start; x <= end; x += step) {
    try {
      // Replace any instances of 'X' with 'x' for mathjs
      const normalizedFn = fn.replace(/X/g, 'x');
      const y = evaluate(normalizedFn, { x });
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x, y });
      }
    } catch (error) {
      console.error('Error evaluating function:', error);
    }
  }
  return points;
};

export const processFunctionData = (data: any): FunctionGraphData => {
  return {
    type: 'function',
    function: data.function,
    domain: data.domain || [-10, 10],
    points: generatePoints(data.function, data.domain),
    gridLines: true,
    labels: {
      x: data.labels?.x || 'x',
      y: data.labels?.y || 'y'
    }
  };
};

export const processGeometricData = (data: any): GeometricData => {
  return {
    type: 'geometric',
    shapes: data.shapes.map((shape: any) => ({
      type: shape.type,
      points: shape.points.map((p: Point) => [p.x, p.y] as [number, number]),
      color: shape.color,
      fillColor: shape.fillColor,
      lineWidth: shape.lineWidth,
      labels: shape.labels?.map((label: any) => ({
        text: label.text,
        position: [label.position.x, label.position.y] as [number, number]
      })),
      measurements: shape.measurements?.map((measurement: any) => ({
        value: measurement.value,
        unit: measurement.unit,
        position: [measurement.position.x, measurement.position.y] as [number, number]
      }))
    })),
    gridLines: true
  };
};

export const processDataGraphData = (data: any): DataGraphData => {
  return {
    type: 'data',
    data: data.data.map((point: any) => ({
      label: point.label,
      value: point.value,
      color: point.color
    })),
    title: data.title,
    labels: data.labels
  };
};

export const processVisualData = (data: any): VisualData | null => {
  try {
    switch (data.type) {
      case 'function':
        return processFunctionData(data);
      case 'geometric':
        return processGeometricData(data);
      case 'data':
        return processDataGraphData(data);
      default:
        console.warn('Unsupported visual type:', data.type);
        return null;
    }
  } catch (error) {
    console.error('Error processing visual data:', error);
    return null;
  }
};
