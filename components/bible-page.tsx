"use client";
import { books } from "@/data/books";
import { AnimatePresence, motion } from "motion/react";
import { Tools } from "@/components/tools";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useVerseStore, Verse } from "@/stores/verse-store";
import { useBibleStore } from "@/stores/bible-store";
import { useSearchParams } from "next/navigation";

export function BiblePage({
  version,
  book,
}: {
  version: string;
  book: string;
}) {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [highlight, setHighlight] = useState(false);
  const [toolOpen, setToolOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
    relativeX: 0,
    relativeY: 0,
  });
  const { verse, setVerse } = useVerseStore();
  const { bibles } = useBibleStore();

  const queryVerse = searchParams.get("verse");
  const queryChapter = searchParams.get("chapter");

  const bible = bibles[version];
  const bookIndex = parseInt(book) - 1;
  const filterByBook = bible?.filter((scripture: Verse) => {
    const bookName = books[bookIndex]?.name;

    if (typeof scripture.book === "string") {
      return scripture.book === bookName;
    } else if (typeof scripture.book === "number") {
      return scripture.book === bookIndex + 1;
    }
    return false;
  });

  let lastChapter = -1;

  // Trigger the highlight when the verse and chapter from the query params match
  useEffect(() => {
    if (queryVerse && queryChapter) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false); // Reset to remove highlight
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [queryVerse, queryChapter]);

  // Track the current chapter when scrolled to
  useEffect(() => {
    const chapters = document.querySelectorAll("[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        });
      },
      { root: null, threshold: 0.5 },
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const captureCursorPosition = (event: MouseEvent) => {
    setCursorPosition({
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY,
      relativeX: event.clientX,
      relativeY: event.clientY,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {filterByBook?.map((scripture: Verse, index: number) => {
        const isNewChapter = parseInt(scripture.chapter) !== lastChapter;
        if (isNewChapter) {
          lastChapter = parseInt(scripture.chapter);
        }

        // Split the text and highlight the parts between < and >
        const processedText = scripture.text
          .replace(/\n/g, "")
          .replace(/’(\s)([a-zA-Z])\b/g, "’$2")
          .replace(/([,.!?;:])([a-zA-Z])/g, "$1 $2")
          .split(/(<.*?>)/g)
          .map((part, i) => {
            if (part.startsWith("<") && part.endsWith(">")) {
              return (
                <span
                  key={i}
                  className={theme === "dark" ? "text-red-300" : "text-red-700"}
                >
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          });

        return (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={index}
          >
            {isNewChapter && (
              <h2
                id={scripture.chapter}
                className="text-2xl font-bold mt-3 mb-2"
              >
                Chapter {scripture.chapter}
              </h2>
            )}
            <div className="text-left">
              <span className="text-[10px] align-top">
                {scripture.verse + " "}
              </span>
              <span
                style={{
                  backgroundColor:
                    highlight &&
                    scripture.verse.toString() === queryVerse &&
                    scripture.chapter === queryChapter
                      ? "yellow"
                      : "transparent",
                  transition: "background-color 1s ease-in-out",
                }}
                onClick={(e) => {
                  captureCursorPosition(e);
                  setToolOpen(true);
                  setVerse(scripture);
                }}
                className="hover:cursor-pointer hover:border-b hover:border-dotted hover:border-primary lg:text-base text-md"
              >
                {processedText}
              </span>
            </div>
          </motion.div>
        );
      })}
      <AnimatePresence>
        {toolOpen && (
          <motion.div exit={{ opacity: 0 }}>
            <Tools
              position={cursorPosition}
              onClose={() => setToolOpen(false)}
              verse={verse ? verse : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
