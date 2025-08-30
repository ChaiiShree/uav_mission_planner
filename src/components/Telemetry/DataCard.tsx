import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: 'operational' | 'warning' | 'critical';
  isUpdating?: boolean;
  classification?: string;
}

export const DataCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status = 'operational',
  isUpdating = false,
  classification = "UNCLASSIFIED"
}: DataCardProps) => {
  const statusClasses = {
    operational: 'tactical-card status-operational',
    warning: 'tactical-card status-warning', 
    critical: 'tactical-card status-critical'
  };

  const statusTextClasses = {
    operational: 'status-operational-text',
    warning: 'status-warning-text',
    critical: 'status-critical-text'
  };

  return (
    <div className={`
      ${statusClasses[status]}
      ${isUpdating ? 'data-updating' : ''}
      p-4 rounded-md
    `}>
      {/* Classification Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
          {classification}
        </div>
        {icon && (
          <div className={`p-1 ${statusTextClasses[status]}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Field Label */}
      <div className="text-sm font-mono text-gray-400 uppercase tracking-wide mb-1">
        {title}
      </div>

      {/* Value Display */}
      <div className="flex items-baseline gap-1">
        <span className="tactical-value text-2xl font-bold font-mono">
          {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 6) : value}
        </span>
        {unit && (
          <span className="text-sm font-mono text-gray-500 ml-1">
            {unit}
          </span>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-2 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full status-indicator ${
          status === 'operational' ? 'status-online' : 
          status === 'warning' ? 'bg-yellow-500' : 'status-offline'
        }`} />
        <span className={`text-xs font-mono uppercase ${statusTextClasses[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};
