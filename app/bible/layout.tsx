"use client";
import { AppSidebar } from "@/components/app-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useToolStore } from "@/stores/tool-store";
import { useVerseStore } from "@/stores/verse-store";
import { useBibleStore } from "@/stores/bible-store";
import { useEffect } from "react";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Moon, Sun, X } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const versions = ["NKJV", "KJV", "NIV"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const currentVersion = pathname.split("/")[2].toUpperCase();
  const { tool, setTool } = useToolStore();
  const { verse } = useVerseStore();
  const { bibles, loadAllBibles } = useBibleStore();

  const handleVersionChange = (version: string) => {
    // Extract the base URL path (book and chapter)
    const currentBookChapter = pathname.split("/").slice(3).join("/");
    const url = window.location.href;
    const fragment = url.includes("#") ? url.split("#")[1] : "";

    router.push(
      `/bible/${version.toLowerCase()}/${currentBookChapter}${fragment ? `#${fragment}` : ""}`,
    );
  };

  useEffect(() => {
    loadAllBibles();
  }, [loadAllBibles]);

  return (
    <SidebarProvider>
      <div className="flex flex-row w-full min-h-screen">
        <AppSidebar version={currentVersion} />
        <SidebarTrigger className="sticky top-0" />
        <div className="w-1/2 min-h-screen p-8 border-r">
          <div
            id="select"
            className="z-10 sticky top-8 flex items-center justify-end"
          >
            <Select onValueChange={handleVersionChange}>
              <SelectTrigger className="w-1/5 bg-primary-foreground">
                <SelectValue placeholder={currentVersion} />
              </SelectTrigger>
              <SelectContent>
                {versions
                  .sort((a, b) => a.localeCompare(b))
                  .map((version, index) => (
                    <SelectItem
                      className="hover:cursor-pointer"
                      value={version}
                      key={index}
                    >
                      {version}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {children}
          <Drawer open={Boolean(tool)}>
            <DrawerContent className="flex flex-col h-[85vh] max-w-4xl mx-auto">
              <DrawerHeader className="border-b">
                <DrawerTitle className="text-2xl font-semibold text-center">
                  Comparing{" "}
                  <span className="font-normal text-muted-foreground">
                    {verse?.book} {verse?.chapter}:{verse?.verse}
                  </span>
                </DrawerTitle>
                <DrawerClose
                  onClick={() => setTool(null)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DrawerClose>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">{currentVersion}</h2>
                    <div className="rounded-md bg-primary/5 p-4 text-lg">
                      {verse?.text.split(/(<.*?>)/g).map((part, i) => {
                        if (part.startsWith("<") && part.endsWith(">")) {
                          return (
                            <span
                              key={i}
                              className="font-semibold text-primary"
                            >
                              {part.slice(1, -1)}
                            </span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">
                      Other Translations
                    </h2>
                    {Object.entries(bibles)
                      .filter(
                        ([key]) =>
                          key.toLowerCase() !== currentVersion.toLowerCase(),
                      )
                      .map(([bibleKey, bibleData]) => {
                        const matchingVerse = bibleData.find(
                          (b) =>
                            b.book === verse?.book &&
                            b.chapter === verse?.chapter &&
                            b.verse === verse?.verse,
                        );

                        if (matchingVerse) {
                          return (
                            <div key={bibleKey} className="space-y-2">
                              <h3 className="font-bold">
                                {bibleKey.toUpperCase()}
                              </h3>
                              <p className="rounded-md bg-secondary/20 p-3">
                                {matchingVerse.text}
                              </p>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter className="border-t py-2">
                <DrawerClose asChild>
                  <button
                    className="py-2 px-6 rounded-lg"
                    onClick={() => setTool(null)}
                  >
                    Done
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <div className="fixed bottom-4 right-4">
            {theme === "dark" ? (
              <button
                onClick={() => setTheme("light")}
                className="p-2 rounded-full hover:bg-primary-foreground transition"
              >
                <Sun className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setTheme("dark")}
                className="p-2 rounded-full hover:bg-primary-foreground transition"
              >
                <Moon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
