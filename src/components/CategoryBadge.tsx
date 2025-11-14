import { cn } from "@/lib/utils";
import { Home, BookOpen, Users, Settings, HelpCircle } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryConfig = {
  Hostel: { icon: Home, className: "bg-muted text-foreground border border-border" },
  Class: { icon: BookOpen, className: "bg-muted text-foreground border border-border" },
  Mentor: { icon: Users, className: "bg-muted text-foreground border border-border" },
  System: { icon: Settings, className: "bg-muted text-foreground border border-border" },
  Other: { icon: HelpCircle, className: "bg-muted text-foreground border border-border" },
};

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.Other;
  const Icon = config.icon;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {category}
    </span>
  );
};
