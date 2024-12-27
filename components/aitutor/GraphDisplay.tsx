import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface GraphDisplayProps {
  data: DataPoint[];
  type: 'bar' | 'pie';
  title?: string;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ data, type, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  if (type === 'bar') {
    return (
      <div className="w-full h-full min-h-[300px] p-4">
        {title && <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>}
        <div className="flex items-end space-x-2 h-[250px]">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full rounded-t-lg transition-all duration-500"
                style={{ 
                  height: `${(point.value / maxValue) * 200}px`,
                  backgroundColor: point.color
                }}
              />
              <div className="text-sm mt-2 text-gray-600 truncate w-full text-center">
                {point.label}
              </div>
              <div className="text-xs text-gray-500">
                {point.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, point) => sum + point.value, 0);
  let currentAngle = 0;

  return (
    <div className="w-full h-full min-h-[300px] p-4">
      {title && <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>}
      <div className="relative w-[250px] h-[250px] mx-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((point, index) => {
            const percentage = (point.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const x1 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 50 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 50 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = `
              M 50 50
              L ${x1} ${y1}
              A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={point.color}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((point, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: point.color }}
            />
            <span className="text-sm text-gray-600">
              {point.label} ({point.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphDisplay;
