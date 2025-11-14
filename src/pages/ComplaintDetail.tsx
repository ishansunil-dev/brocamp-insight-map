import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ArrowLeft, MessageSquare, Clock, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useComplaint, useComplaintComments, useAddComment } from "@/hooks/useComplaints";

const ComplaintDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  
  const { data: complaint, isLoading: complaintLoading } = useComplaint(id || "");
  const { data: comments = [], isLoading: commentsLoading } = useComplaintComments(id || "");
  const addComment = useAddComment();

  const handleAddComment = () => {
    if (!comment.trim() || !id) return;
    
    addComment.mutate(
      {
        complaintId: id,
        message: comment,
      },
      {
        onSuccess: () => {
          setComment("");
        },
      }
    );
  };

  if (complaintLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Loading complaint...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center bg-white/95 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Not Found</h2>
          <p className="text-muted-foreground mb-4">The complaint you're looking for doesn't exist</p>
          <Button onClick={() => navigate("/complaints")}>View All Complaints</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 left-1/2 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/complaints")} className="gap-2 mb-2 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-white/80">{complaint.reference_id}</span>
                <StatusBadge status={complaint.status} />
              </div>
              <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-foreground leading-relaxed">{complaint.description}</p>
            </Card>

            {/* Comments */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
              </div>

              <div className="space-y-4 mb-6">
                {commentsLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="border-l-2 border-primary/20 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{c.profiles?.name || "Anonymous"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{c.message}</p>
                    </div>
                  ))
                )}
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
            <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20">
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
                    {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
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
    </div>
  );
};

export default ComplaintDetail;
