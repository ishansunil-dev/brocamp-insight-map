import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ComplaintCardProps {
  complaint: {
    id: string;
    referenceId: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    commentCount?: number;
  };
  onClick?: () => void;
}

export const ComplaintCard = ({ complaint, onClick }: ComplaintCardProps) => {
  return (
    <Card 
      className="p-5 hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono text-muted-foreground">{complaint.referenceId}</span>
            <StatusBadge status={complaint.status} />
          </div>
          
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {complaint.title}
          </h3>
          
          <div className="flex items-center gap-3 flex-wrap">
            <CategoryBadge category={complaint.category} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
            </div>
            {complaint.commentCount !== undefined && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {complaint.commentCount} comments
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
