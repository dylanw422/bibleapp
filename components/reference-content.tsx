import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useToolStore } from "@/stores/tool-store";
import { Verse } from "@/stores/verse-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { books } from "@/data/books";

export function ReferenceContent({
  verse,
  currentVersion,
  bibles,
}: {
  verse: Verse | null;
  currentVersion: string;
  bibles: object;
}) {
  const [highlight, setHighlight] = useState<string>("");
  const { tool, setTool } = useToolStore();
  const router = useRouter();
  const { theme } = useTheme();

  const handleReferenceClick = (
    bookName: string,
    chapter: string,
    verse: number,
  ) => {
    router.push(
      `${books.findIndex((book) => book.name.toLowerCase() === bookName.toLowerCase()) + 1}?chapter=${chapter}&verse=${verse}#${chapter}`,
    );
    setTool(null);
    setHighlight("");
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString() && selection.toString().length < 3) {
      setHighlight("");
    } else if (selection && selection.toString()) {
      setHighlight(selection.toString());
    }
  };

  useEffect(() => {
    // Listen for text selection (mouse up)
    document.addEventListener("mouseup", handleSelection);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  return (
    <Drawer open={Boolean(tool === "References")}>
      <DrawerContent className="flex flex-col h-[85vh] max-w-5xl mx-auto">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-2xl font-semibold text-center">
            Referencing{" "}
            <span className="font-normal text-muted-foreground">
              {verse?.book} {verse?.chapter}:{verse?.verse}
            </span>
          </DrawerTitle>
          <DrawerClose
            onClick={() => {
              setTool(null);
              setHighlight("");
            }}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-muted-foreground text-sm font-semibold">
                Highlight the text you want to find references for:{" "}
              </span>
              <div
                className="rounded-md bg-primary/5 p-4"
                style={{ userSelect: "text" }}
              >
                {verse?.text.split(/(<.*?>)/g).map((part, i) => {
                  if (part.startsWith("<") && part.endsWith(">")) {
                    return (
                      <span key={i} className="font-semibold text-primary">
                        {part.slice(1, -1)}
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
            <div className="space-y-6">
              {highlight && (
                <h2 className="text-lg font-semibold">
                  Finding references for{" "}
                  <span>
                    {verse?.book} {verse?.chapter}:{verse?.verse}
                  </span>
                </h2>
              )}
              {Object.entries(bibles)
                .filter(([key]) => key.toLowerCase() === currentVersion)
                .map(([bibleKey, bibleData]) => {
                  const matchingVerses = bibleData
                    .filter((a: Verse) => a.uuid !== verse?.uuid)
                    .filter((b: Verse) => {
                      // Sanitize both verse text and highlight for comparison (removes punctuation)
                      const sanitizedText = b.text
                        .toLowerCase()
                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                      const sanitizedHighlight = highlight
                        .toLowerCase()
                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                      return sanitizedText.includes(sanitizedHighlight);
                    });

                  if (matchingVerses.length > 0 && highlight) {
                    return (
                      <div key={bibleKey} className="">
                        {matchingVerses.map((verse: Verse, index: number) => {
                          // Sanitize the highlight for splitting the text around the match
                          const sanitizedHighlight = highlight.replace(
                            /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                            "",
                          );

                          // Split the verse text around the sanitized highlight match (case-insensitive)
                          const parts = verse.text
                            .replace(/\n/g, "")
                            .replace(/<|>/g, "")
                            .replace(/([,.!?;:])([a-zA-Z])/g, "$1 $2")
                            .split(new RegExp(`(${sanitizedHighlight})`, "gi"));

                          return (
                            <div
                              key={index}
                              className="rounded-md bg-secondary/20 p-3"
                            >
                              <p>
                                <strong>
                                  {verse.book} {verse.chapter}:{verse.verse}
                                </strong>
                              </p>
                              <p
                                onClick={() =>
                                  handleReferenceClick(
                                    verse.book.toLowerCase(),
                                    verse.chapter,
                                    verse.verse,
                                  )
                                } // redirect to verse
                                className="hover:cursor-pointer hover:underline decoration-dotted underline-offset-2 decoration-1"
                              >
                                {parts.map((part: string, i: number) => {
                                  // Sanitize the current part for comparison
                                  const sanitizedPart = part
                                    .toLowerCase()
                                    .replace(
                                      /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                                      "",
                                    );

                                  return sanitizedPart ===
                                    sanitizedHighlight.toLowerCase() ? (
                                    <span
                                      key={i}
                                      className={`bg-yellow-300 ${theme === "dark" ? "text-secondary" : "text-primary"} font-semibold`}
                                    >
                                      {part}
                                      {/* Use the original part with punctuation */}
                                    </span>
                                  ) : (
                                    <span className="" key={i}>
                                      {part}
                                    </span>
                                  );
                                })}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else if (matchingVerses.length === 0 && highlight) {
                    return (
                      <div key={bibleKey} className="">
                        <p className="text-muted-foreground">
                          No references found.
                        </p>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </ScrollArea>
        <DrawerFooter className="border-t py-2">
          <DrawerClose asChild>
            <button
              className="py-2 px-6 rounded-lg"
              onClick={() => {
                setTool(null);
                setHighlight("");
              }}
            >
              Done
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
