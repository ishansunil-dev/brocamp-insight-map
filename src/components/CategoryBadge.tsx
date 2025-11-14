import { cn } from "@/lib/utils";
import { Home, BookOpen, Users, Settings, HelpCircle } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryConfig = {
  Hostel: { icon: Home, className: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
  Class: { icon: BookOpen, className: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  Mentor: { icon: Users, className: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400" },
  System: { icon: Settings, className: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400" },
  Other: { icon: HelpCircle, className: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
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
