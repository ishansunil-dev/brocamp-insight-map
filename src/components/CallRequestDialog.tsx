import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface CallRequestDialogProps {
  onSubmit: (notes: string, preferredTime?: string) => void;
  isPending: boolean;
}

export const CallRequestDialog = ({ onSubmit, isPending }: CallRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const handleSubmit = () => {
    onSubmit(notes, preferredTime || undefined);
    setOpen(false);
    setNotes("");
    setPreferredTime("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50">
          <Phone className="h-4 w-4" />
          Request Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Request Admin Call
          </DialogTitle>
          <DialogDescription>
            Request a call from an admin to discuss this complaint. They will contact you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred Time (Optional)</Label>
            <Input
              id="preferred-time"
              type="datetime-local"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific points you'd like to discuss..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            {isPending ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
