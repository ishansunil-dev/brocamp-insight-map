import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig = {
  new: { label: "New", className: "bg-neon/10 text-neon border-neon/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]" },
  in_review: { label: "In Review", className: "bg-muted text-foreground border-border" },
  in_progress: { label: "In Progress", className: "bg-muted text-foreground border-border" },
  resolved: { label: "Resolved", className: "bg-muted text-muted-foreground border-border" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
  reopened: { label: "Reopened", className: "bg-muted text-destructive border-border" },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
