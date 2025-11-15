import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-neon to-accent bg-clip-text text-transparent animate-scale-in">
              BROCAMP
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-semibold text-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            COMPLAINT HUB
          </h2>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
          Your voice matters. Submit and track complaints seamlessly.
        </p>

        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 hover-scale"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <div className="p-6 rounded-lg bg-card border border-border hover:border-neon transition-all duration-300 hover-scale">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Easy Submission</h3>
            <p className="text-sm text-muted-foreground">Submit complaints quickly with our intuitive interface</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border hover:border-neon transition-all duration-300 hover-scale">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">Monitor your complaint status in real-time</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border hover:border-neon transition-all duration-300 hover-scale">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Fast Resolution</h3>
            <p className="text-sm text-muted-foreground">Get quick responses from our dedicated team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
