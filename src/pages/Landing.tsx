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
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 left-1/2 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight animate-fade-in flex items-center justify-center gap-0">
            <span className="bg-white text-black px-4 py-2 rounded-lg shadow-2xl animate-scale-in">
              BRO
            </span>
            <span className="text-white animate-scale-in [text-shadow:0_0_30px_rgba(255,255,255,0.5)]" style={{ animationDelay: "0.15s" }}>
              CAMP
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-semibold text-white animate-fade-in [text-shadow:0_0_20px_rgba(255,255,255,0.3)]" style={{ animationDelay: "0.3s" }}>
            COMPLAINT HUB
          </h2>
        </div>
        
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
          Your voice matters. Submit and track complaints seamlessly.
        </p>

        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/50"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:bg-white/20 shadow-xl">
            <div className="text-4xl mb-4 animate-bounce">📝</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Easy Submission</h3>
            <p className="text-sm text-white/80">Submit complaints quickly with our intuitive interface</p>
          </div>
          <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:bg-white/20 shadow-xl" style={{ animationDelay: "0.1s" }}>
            <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: "0.2s" }}>🔍</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
            <p className="text-sm text-white/80">Monitor your complaint status in real-time</p>
          </div>
          <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:bg-white/20 shadow-xl" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: "0.4s" }}>⚡</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Fast Resolution</h3>
            <p className="text-sm text-white/80">Get quick responses from our dedicated team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
