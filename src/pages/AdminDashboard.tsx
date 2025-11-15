import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useComplaints, useComplaintStats } from "@/hooks/useComplaints";
import { useAuth } from "@/hooks/useAuth";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: complaints, isLoading } = useComplaints();
  const { data: stats, isLoading: statsLoading } = useComplaintStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredComplaints = complaints?.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.reference_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const statCards = [
    {
      title: "Total Complaints",
      value: stats?.total || 0,
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Pending",
      value: stats?.new || 0,
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: AlertCircle,
      color: "text-blue-500"
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage and oversee all complaints</p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300 hover-scale"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Filters */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Complaints List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Complaints ({filteredComplaints?.length || 0})</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-32 w-full" />
                </Card>
              ))
            ) : filteredComplaints?.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No complaints found</p>
              </Card>
            ) : (
              filteredComplaints?.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => navigate(`/complaint/${complaint.id}`)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {filteredComplaints?.filter(c => c.status === "new").map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => navigate(`/complaint/${complaint.id}`)}
              />
            ))}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {filteredComplaints?.filter(c => c.status === "in_progress").map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => navigate(`/complaint/${complaint.id}`)}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {filteredComplaints?.filter(c => c.status === "resolved").map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => navigate(`/complaint/${complaint.id}`)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
