import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: 'operational' | 'warning' | 'critical';
  isUpdating?: boolean;
  classification?: string;
  size?: 'compact' | 'normal' | 'large';
  showProgress?: boolean;
  progressValue?: number;
}

export const DataCard = ({
  title,
  value,
  unit,
  icon,
  status = 'operational',
  isUpdating = false,
  classification,
  size = 'normal',
  showProgress = false,
  progressValue = 0
}: DataCardProps) => {
  const statusClasses = {
    operational: 'data-card status-operational',
    warning: 'data-card status-warning',
    critical: 'data-card status-critical'
  };

  const statusTextClasses = {
    operational: 'status-operational-text',
    warning: 'status-warning-text',
    critical: 'status-critical-text'
  };

  const sizeClasses = {
    compact: 'data-card-compact',
    normal: 'data-card-normal',
    large: 'data-card-large'
  };

  return (
    <div className={`${statusClasses[status]} ${sizeClasses[size]} ${isUpdating ? 'data-updating' : ''}`}>
      {/* Header */}
      <div className="data-card-header">
        <div className="flex items-center gap-2">
          {icon && <div className="data-card-icon">{icon}</div>}
          <h3 className="data-card-title">{title}</h3>
        </div>
        {classification && (
          <div className="data-card-classification">{classification}</div>
        )}
      </div>
      
      {/* Value */}
      <div className={`data-card-value ${statusTextClasses[status]}`}>
        <span className="value-main">{value}</span>
        {unit && <span className="value-unit">{unit}</span>}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${status}`}
              style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  );
};
