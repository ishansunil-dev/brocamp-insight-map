import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ArrowLeft, MessageSquare, Clock, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockComplaints } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ComplaintDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  
  const complaint = mockComplaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Not Found</h2>
          <p className="text-muted-foreground mb-4">The complaint you're looking for doesn't exist</p>
          <Button onClick={() => navigate("/complaints")}>View All Complaints</Button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully",
    });
    setComment("");
  };

  const mockComments = [
    {
      id: "1",
      author: "Admin Team",
      message: "Thank you for reporting this issue. We're looking into it.",
      timestamp: "2025-01-10T11:00:00Z",
      isInternal: false,
    },
    {
      id: "2",
      author: "IT Department",
      message: "Router replacement scheduled for tomorrow morning.",
      timestamp: "2025-01-10T15:30:00Z",
      isInternal: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/complaints")} className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">{complaint.referenceId}</span>
                <StatusBadge status={complaint.status} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{complaint.title}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-foreground leading-relaxed">{complaint.description}</p>
            </Card>

            {/* Comments */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Comments ({mockComments.length})</h2>
              </div>

              <div className="space-y-4 mb-6">
                {mockComments.map((c) => (
                  <div key={c.id} className="border-l-2 border-primary/20 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{c.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{c.message}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <CategoryBadge category={complaint.category} />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <PriorityBadge priority={complaint.priority} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={complaint.status} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reporter</p>
                  <p className="text-sm font-medium">
                    {complaint.anonymous ? "Anonymous" : "Student"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
