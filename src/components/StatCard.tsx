import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, description, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-4xl font-bold font-mono text-foreground animate-count" style={{ animationDelay: `${delay + 200}ms` }}>
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
