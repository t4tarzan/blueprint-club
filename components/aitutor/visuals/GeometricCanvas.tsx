import React, { useEffect, useRef } from 'react';
import { GeometricData, BaseVisualProps, GeometricShape } from '@/types/graph';

interface GeometricCanvasProps extends BaseVisualProps {
  data: GeometricData;
}

export const GeometricCanvas: React.FC<GeometricCanvasProps> = ({
  data,
  width = 600,
  height = 400,
  theme = 'light',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set background color
    ctx.fillStyle = isDark ? '#1F2937' : '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines if enabled
    if (data.gridLines) {
      ctx.strokeStyle = isDark ? '#374151' : '#E5E7EB';
      ctx.lineWidth = 0.5;

      // Draw vertical grid lines
      for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw shapes
    data.shapes.forEach((shape: GeometricShape) => {
      if (!shape.points || shape.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = shape.color || (isDark ? '#F3F4F6' : '#1F2937');
      ctx.fillStyle = shape.fillColor || 'rgba(79, 70, 229, 0.1)';
      ctx.lineWidth = shape.lineWidth || 2;

      // Move to first point
      ctx.moveTo(shape.points[0][0], shape.points[0][1]);

      // Draw lines to subsequent points
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i][0], shape.points[i][1]);
      }

      // Close path if it's a closed shape
      if (shape.type === 'polygon' || shape.type === 'rectangle') {
        ctx.closePath();
      }

      // Fill and stroke the shape
      if (shape.fillColor) {
        ctx.fill();
      }
      ctx.stroke();

      // Draw labels if present
      if (shape.labels) {
        ctx.font = '14px Arial';
        ctx.fillStyle = isDark ? '#F3F4F6' : '#1F2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        shape.labels.forEach(label => {
          if (label.text && label.position) {
            ctx.fillText(label.text, label.position[0], label.position[1]);
          }
        });
      }

      // Draw measurements if present
      if (shape.measurements) {
        ctx.font = '12px Arial';
        ctx.fillStyle = isDark ? '#F3F4F6' : '#1F2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        shape.measurements.forEach(measurement => {
          if (measurement.value && measurement.position) {
            ctx.fillText(
              `${measurement.value}${measurement.unit || ''}`,
              measurement.position[0],
              measurement.position[1]
            );
          }
        });
      }
    });
  }, [data, width, height, theme, interactive]);

  return (
    <div
      className={`relative rounded-lg p-4 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
