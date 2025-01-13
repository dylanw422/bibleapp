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

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentVersion = pathname.split("/")[2];
  const { verse } = useVerseStore();
  const { bibles, loadAllBibles } = useBibleStore();

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
      </div>
    </SidebarProvider>
  );
}
