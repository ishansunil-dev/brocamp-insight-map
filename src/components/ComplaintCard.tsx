import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Complaint } from "@/hooks/useComplaints";

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export const ComplaintCard = ({ complaint, onClick }: ComplaintCardProps) => {
  return (
    <Card 
      className="p-5 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer border-border hover:border-neon"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono text-neon [text-shadow:0_0_10px_rgba(0,229,255,0.5)]">{complaint.reference_id}</span>
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
              {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
