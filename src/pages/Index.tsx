import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Plus, TrendingUp, Clock, CheckCircle2, AlertCircle, LogOut, LogIn, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useComplaints, useComplaintStats } from "@/hooks/useComplaints";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: complaints = [], isLoading: complaintsLoading } = useComplaints();
  const { data: stats, isLoading: statsLoading } = useComplaintStats();
  
  const recentComplaints = complaints.slice(0, 3);
  const mockStats = stats || { total: 0, new: 0, inProgress: 0, resolved: 0 };

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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Brocamp Complaints</h1>
              <p className="text-sm text-white/80 mt-1">Track and manage student concerns</p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button onClick={() => navigate("/submit")} size="lg" className="gap-2 bg-white text-purple-600 hover:bg-white/90">
                    <Plus className="h-5 w-5" />
                    Submit Complaint
                  </Button>
                  <Button onClick={() => navigate("/profile")} variant="outline" size="lg" className="gap-2 border-white/30 text-white hover:bg-white/10">
                    <UserCircle className="h-5 w-5" />
                    Profile
                  </Button>
                  <Button onClick={signOut} variant="outline" size="lg" className="gap-2 border-white/30 text-white hover:bg-white/10">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/auth")} size="lg" className="gap-2 bg-white text-purple-600 hover:bg-white/90">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-4xl font-bold text-foreground mt-2 [text-shadow:0_0_10px_rgba(0,229,255,0.3)]">{mockStats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-foreground" />
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">{mockStats.new}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-4xl font-bold text-foreground mt-2">{mockStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-foreground" />
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm border-white/20 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-4xl font-bold text-foreground mt-2">{mockStats.resolved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-foreground" />
            </div>
          </Card>
        </div>

        {/* Recent Complaints */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Complaints</h2>
              <p className="text-sm text-white/80 mt-1">Latest issues reported by students</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/complaints")} className="border-white/30 text-white hover:bg-white/10 bg-white/5">
              View All
            </Button>
          </div>

          <div className="grid gap-4">
            {complaintsLoading ? (
              <div className="text-center py-8 bg-white/95 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-muted-foreground">Loading complaints...</p>
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="text-center py-8 bg-white/95 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-muted-foreground">No complaints yet. Be the first to submit one!</p>
              </div>
            ) : (
              recentComplaints.map((complaint) => (
                <div key={complaint.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20">
                  <ComplaintCard
                    complaint={complaint}
                    onClick={() => navigate(`/complaint/${complaint.id}`)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Index;
