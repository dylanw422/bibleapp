"use client";
import { books } from "@/data/books";
import { AnimatePresence, motion } from "motion/react";
import { Tools } from "@/components/tools";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export interface Scripture {
  book: string;
  chapter: string;
  verse: number;
  text: string;
  uuid: string;
  woj: boolean;
}

export function BiblePage({
  version,
  book,
}: {
  version: string;
  book: string;
}) {
  const { theme } = useTheme();
  const [toolOpen, setToolOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
    relativeX: 0,
    relativeY: 0,
  });
  const [verse, setVerse] = useState<Scripture | undefined>();

  const bible = JSON.parse(version);
  const bookIndex = parseInt(book) - 1;
  const filterByBook = bible.filter((scripture: Scripture) => {
    const bookName = books[bookIndex]?.name;

    if (typeof scripture.book === "string") {
      return scripture.book === bookName;
    } else if (typeof scripture.book === "number") {
      return scripture.book === bookIndex + 1;
    }
    return false;
  });

  let lastChapter = -1;

  useEffect(() => {
    const chapters = document.querySelectorAll("[id]"); // Select elements with `id`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update the URL fragment when a chapter comes into view
            const id = entry.target.getAttribute("id");
            if (id) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        });
      },
      { root: null, threshold: 0.5 },
    );

    // Observe each chapter element
    chapters.forEach((chapter) => observer.observe(chapter));

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  const captureCursorPosition = (event) => {
    setCursorPosition({
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY,
      relativeX: event.clientX,
      relativeY: event.clientY,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {filterByBook.map((scripture: Scripture, index: number) => {
        const isNewChapter = parseInt(scripture.chapter) !== lastChapter;
        if (isNewChapter) {
          lastChapter = parseInt(scripture.chapter);
        }

        // Split the text and highlight the parts between < and >
        const processedText = scripture.text
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
                className="text-2xl font-bold mt-6 mb-2"
              >
                Chapter {scripture.chapter}
              </h2>
            )}
            <div className="text-left">
              <span className="text-[10px] align-top">
                {scripture.verse + " "}
              </span>
              <span
                onClick={(e) => {
                  captureCursorPosition(e);
                  setToolOpen(true);
                  setVerse(scripture);
                }}
                className="hover:cursor-pointer hover:border-b hover:border-dotted hover:border-primary"
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
              verse={verse}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
