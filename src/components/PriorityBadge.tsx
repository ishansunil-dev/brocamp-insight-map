import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Circle } from "lucide-react";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityConfig = {
  low: { 
    label: "Low", 
    className: "text-muted-foreground",
    icon: Circle
  },
  medium: { 
    label: "Medium", 
    className: "text-warning",
    icon: AlertCircle
  },
  high: { 
    label: "High", 
    className: "text-destructive",
    icon: AlertTriangle
  },
};

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
  const Icon = config.icon;
  
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", config.className, className)}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
};
