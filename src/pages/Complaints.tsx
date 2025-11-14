import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintCard } from "@/components/ComplaintCard";
import { mockComplaints } from "@/data/mockData";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Complaints = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 mb-2 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">All Complaints</h1>
          <p className="text-sm text-white/80 mt-1">
            Browse and search through all reported issues
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or reference ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Hostel">Hostel</SelectItem>
                  <SelectItem value="Class">Class</SelectItem>
                  <SelectItem value="Mentor">Mentor</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <p className="text-sm text-white/80">
            Showing {filteredComplaints.length} of {mockComplaints.length} complaints
          </p>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white/95 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-muted-foreground">No complaints found matching your filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20">
                <ComplaintCard
                  complaint={complaint}
                  onClick={() => navigate(`/complaint/${complaint.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default Complaints;
