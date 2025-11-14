import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CallRequestDialog } from "@/components/CallRequestDialog";
import { ArrowLeft, MessageSquare, Clock, User, Phone, XCircle, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useComplaint, useComplaintComments, useAddComment, useCallRequest, useCreateCallRequest, useCancelCallRequest } from "@/hooks/useComplaints";

const ComplaintDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  
  const { data: complaint, isLoading: complaintLoading } = useComplaint(id || "");
  const { data: comments = [], isLoading: commentsLoading } = useComplaintComments(id || "");
  const { data: callRequest, isLoading: callRequestLoading } = useCallRequest(id || "");
  const addComment = useAddComment();
  const createCallRequest = useCreateCallRequest();
  const cancelCallRequest = useCancelCallRequest();

  const handleAddComment = () => {
    if (!comment.trim() || !id) return;
    
    addComment.mutate(
      {
        complaintId: id,
        comment: comment,
      },
      {
        onSuccess: () => {
          setComment("");
        },
      }
    );
  };

  const handleCallRequest = (notes: string, preferredTime?: string) => {
    if (!id) return;
    createCallRequest.mutate({
      complaintId: id,
      notes,
      preferredTime,
    });
  };

  const handleCancelCallRequest = () => {
    if (!callRequest?.id) return;
    cancelCallRequest.mutate(callRequest.id);
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
                      <p className="text-sm text-foreground">{c.comment}</p>
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

            {/* Call Request Card */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Request
              </h2>
              
              {callRequestLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : callRequest ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      {callRequest.status === "pending" && (
                        <>
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-600">Pending</span>
                        </>
                      )}
                      {callRequest.status === "scheduled" && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Scheduled</span>
                        </>
                      )}
                      {callRequest.status === "completed" && (
                        <>
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Completed</span>
                        </>
                      )}
                      {callRequest.status === "cancelled" && (
                        <>
                          <XCircle className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Cancelled</span>
                        </>
                      )}
                    </div>
                  </div>

                  {callRequest.scheduled_time && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Scheduled Time</p>
                      <p className="text-sm font-medium">
                        {new Date(callRequest.scheduled_time).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {callRequest.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Your Notes</p>
                      <p className="text-sm">{callRequest.notes}</p>
                    </div>
                  )}

                  {callRequest.admin_notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
                      <p className="text-sm">{callRequest.admin_notes}</p>
                    </div>
                  )}

                  {callRequest.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelCallRequest}
                      disabled={cancelCallRequest.isPending}
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {cancelCallRequest.isPending ? "Cancelling..." : "Cancel Request"}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Need to discuss this issue? Request a call from our admin team.
                  </p>
                  <CallRequestDialog
                    onSubmit={handleCallRequest}
                    isPending={createCallRequest.isPending}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default ComplaintDetail;
