import { useState } from "react";
import { useToolStore } from "@/stores/tool-store";
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Verse } from "@/stores/verse-store";
import { SignInButton, useSession, useUser } from "@clerk/clerk-react";
import axios from "axios";

export function NotesContent({ verse }: { verse: Verse | null }) {
  const { tool, setTool } = useToolStore();
  const { isSignedIn } = useSession();
  const { user } = useUser();
  const [note, setNote] = useState("");

  const submitNote = async () => {
    await axios.post("/api/addNote", {
      note,
      references: verse,
      forUser: user?.id,
    });
    setTool(null);
  };

  return isSignedIn ? (
    <Dialog open={Boolean(tool === "Add Note")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Note to {verse?.book} {verse?.chapter}:{verse?.verse}
          </DialogTitle>
          <button onClick={() => setTool(null)}>
            <X className="absolute top-2 right-2 w-4 h-4" />
          </button>
          <DialogDescription>
            <Textarea
              onChange={(e) => setNote(e.target.value)}
              className="my-4"
            />
          </DialogDescription>
          <div className="flex space-x-2">
            <Button
              onClick={() => setTool(null)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={() => submitNote()} className="flex-1">
              Done
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={Boolean(tool === "Add Note")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Must be signed in to add notes</DialogTitle>
          <p className="pb-4 text-muted-foreground">
            Please sign in to add notes to this verse.
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => setTool(null)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <SignInButton>
              <Button className="flex-1">Sign In</Button>
            </SignInButton>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
