import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Book, VolumeIcon, Languages } from "lucide-react";
import { useToolStore } from "@/stores/tool-store";
import { Verse } from "@/stores/verse-store";
import { books } from "@/data/books";

export function InterlinearContent({
  verse,
  currentVersion,
  originalText,
}: {
  verse: Verse | null;
  currentVersion: string;
  originalText: Verse[];
}) {
  const { tool, setTool } = useToolStore();

  const versionData = originalText ? originalText : undefined;

  const matchingVerse = versionData
    ? versionData.find(
        (b: Verse) =>
          b.book === verse?.book &&
          b.chapter === verse?.chapter &&
          b.verse === verse?.verse,
      )
    : null;

  return (
    <Drawer open={Boolean(tool === "Hebrew / Greek")}>
      <DrawerContent className="flex flex-col h-[85vh] max-w-5xl mx-auto">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-2xl font-semibold text-center">
            Translating{" "}
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
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentVersion?.toUpperCase()} Translation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
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
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Original Text Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="original" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="original">
                      <Book className="w-4 h-4 mr-2" />
                      Original
                    </TabsTrigger>
                    <TabsTrigger value="pronunciation">
                      <VolumeIcon className="w-4 h-4 mr-2" />
                      Pronunciation
                    </TabsTrigger>
                    <TabsTrigger value="literal">
                      <Languages className="w-4 h-4 mr-2" />
                      Literal
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="original">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {books.findIndex(
                            (book) => book.name === matchingVerse?.book,
                          ) < 39
                            ? "Hebrew Translation"
                            : "Greek Translation"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p
                          className="text-2xl font-semibold"
                          dir={
                            books.findIndex(
                              (book) => book.name === matchingVerse?.book,
                            ) < 39
                              ? "rtl"
                              : "ltr"
                          }
                        >
                          {matchingVerse?.translation}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="pronunciation">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pronunciation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg italic">
                          {matchingVerse?.diction}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="literal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Literal Translation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg">{matchingVerse?.text}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <DrawerFooter className="border-t py-2">
          <DrawerClose asChild>
            <button onClick={() => setTool(null)} className="py-2 px-6">
              Done
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
