"use client";
import { AppSidebar } from "@/components/app-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useVerseStore } from "@/stores/verse-store";
import { useBibleStore } from "@/stores/bible-store";
import { useEffect } from "react";
import { CompareContent } from "@/components/compare-content";
import { ModeToggle } from "@/components/mode-toggle";
import { VersionSelect } from "@/components/version-select";
import { InterlinearContent } from "@/components/interlinear-content";
import { ReferenceContent } from "@/components/reference-content";
import { SearchBar } from "@/components/search-bar";
import { NotesContent } from "@/components/notes-content";
import { NotesSection } from "@/components/notes-section";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/lib/queries";
import { books } from "@/data/books";
import { Verse } from "@/stores/verse-store";

interface Note {
  id: string;
  note: string;
  references: Verse;
  forUser: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentVersion = pathname.split("/")[2];
  const currentBook = pathname.split("/")[3];
  const currentBookString = books[parseInt(currentBook, 10) - 1]?.name || null;
  const { verse } = useVerseStore();
  const { bibles, loadAllBibles } = useBibleStore();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  useEffect(() => {
    loadAllBibles();
  }, [loadAllBibles]);

  return (
    <SidebarProvider>
      <div className="flex flex-row w-full min-h-screen">
        <AppSidebar version={currentVersion} />
        <SidebarTrigger className="sticky top-0" />
        <div className="lg:w-3/5 w-full min-h-screen pl-4 border-r">
          <div className="z-10 sticky top-0 py-4 pr-4 w-full border-b flex items-center bg-white justify-between">
            <SearchBar version={bibles[currentVersion]} />
            <VersionSelect />
          </div>
          <div className="pr-4">{children}</div>
          <CompareContent
            verse={verse}
            currentVersion={currentVersion}
            bibles={bibles}
          />
          <InterlinearContent
            verse={verse}
            currentVersion={currentVersion}
            originalText={bibles["interlinear"]}
          />
          <ReferenceContent
            verse={verse}
            currentVersion={currentVersion}
            bibles={bibles}
          />
          <NotesContent verse={verse} />
          <ModeToggle />
        </div>
        <div className="w-1/4 sticky top-0 h-screen overflow-y-auto">
          <NotesSection
            notes={notesQuery.data?.filter(
              (note: Note) => note.references.book === currentBookString,
            )}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
