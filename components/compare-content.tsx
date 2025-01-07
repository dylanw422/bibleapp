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

export function CompareContent({
  verse,
  currentVersion,
  bibles,
}: {
  verse: Verse | null;
  currentVersion: string;
  bibles: object;
}) {
  const { tool, setTool } = useToolStore();

  return (
    <Drawer open={Boolean(tool === "Compare")}>
      <DrawerContent className="flex flex-col h-[85vh] max-w-5xl mx-auto">
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
              <div className="rounded-md bg-primary/5 p-4">
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
              <h2 className="text-lg font-semibold">Other Translations</h2>
              {Object.entries(bibles)
                .filter(
                  ([key]) => key.toLowerCase() !== currentVersion.toLowerCase(),
                )
                .filter(([key]) => key !== "interlinear")
                .map(([bibleKey, bibleData]) => {
                  const matchingVerse = bibleData.find(
                    (b: Verse) =>
                      b.book === verse?.book &&
                      b.chapter === verse?.chapter &&
                      b.verse === verse?.verse,
                  );

                  if (matchingVerse) {
                    return (
                      <div key={bibleKey} className="">
                        <h3 className="font-bold">{bibleKey.toUpperCase()}</h3>
                        <p className="rounded-md bg-secondary/20 p-3">
                          {matchingVerse.text
                            .replace(/\n/g, "")
                            .split(/(<.*?>)/g)
                            .map((part: string, i: number) => {
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
  );
}
