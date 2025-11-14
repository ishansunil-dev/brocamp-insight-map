import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/ComplaintCard";
import { mockComplaints, mockStats } from "@/data/mockData";
import { Plus, TrendingUp, Clock, CheckCircle2, AlertCircle, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const recentComplaints = mockComplaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Brocamp Complaints</h1>
              <p className="text-sm text-muted-foreground mt-1">Track and manage student concerns</p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button onClick={() => navigate("/submit")} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Submit Complaint
                  </Button>
                  <Button onClick={signOut} variant="outline" size="lg" className="gap-2">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
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
          <Card className="p-6 hover:border-neon hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-4xl font-bold text-foreground mt-2 [text-shadow:0_0_10px_rgba(0,229,255,0.3)]">{mockStats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-foreground" />
            </div>
          </Card>

          <Card className="p-6 hover:border-neon hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-4xl font-bold text-neon mt-2 [text-shadow:0_0_15px_rgba(0,229,255,0.5)]">{mockStats.new}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-neon" />
            </div>
          </Card>

          <Card className="p-6 hover:border-neon hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-4xl font-bold text-foreground mt-2 [text-shadow:0_0_10px_rgba(0,229,255,0.3)]">{mockStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-foreground" />
            </div>
          </Card>

          <Card className="p-6 hover:border-neon hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-4xl font-bold text-foreground mt-2 [text-shadow:0_0_10px_rgba(0,229,255,0.3)]">{mockStats.resolved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-foreground" />
            </div>
          </Card>
        </div>

        {/* Recent Complaints */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recent Complaints</h2>
              <p className="text-sm text-muted-foreground mt-1">Latest issues reported by students</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/complaints")}>
              View All
            </Button>
          </div>

          <div className="grid gap-4">
            {recentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => navigate(`/complaint/${complaint.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
