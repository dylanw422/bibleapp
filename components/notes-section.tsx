import { Verse } from "@/stores/verse-store";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { queryClient } from "@/components/query-provider";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  note: string;
  references: Verse;
  forUser: string;
}

export function NotesSection({ notes }: { notes: Note[] }) {
  const [confirm, setConfirm] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const noteMutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/deleteNote", { id });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNote = async () => {
    setConfirm(false);
    noteMutation.mutate();
  };

  return (
    <div className="p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      {notes?.map((note, index) => {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={index}
            className="py-2 text-sm border-b relative"
          >
            <h1 className="text-primary/70 font-bold">
              {note.references.book} {note.references.chapter}:
              {note.references.verse}
            </h1>
            <p className="pr-10">{note.note}</p>
            <X
              onClick={() => {
                setConfirm(true);
                setId(note.id);
              }}
              className="w-3 h-3 text-primary/50 absolute right-2 top-[50%] translate-y-[-50%] hover:cursor-pointer"
            />
          </motion.div>
        );
      })}
      <Dialog open={confirm}>
        <DialogContent className="outline-none">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this note?
            </DialogTitle>
            <DialogDescription className="pb-4">
              This action cannot be undone and will permanently delete the
              selected note.
            </DialogDescription>
            <div className="w-full flex space-x-2">
              <Button
                onClick={() => setConfirm(false)}
                variant={"secondary"}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteNote()}
                variant={"destructive"}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
