import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Verse } from "@/stores/verse-store";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar({ version }: { version: Verse[] }) {
  const [search, setSearch] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [results, setResults] = useState<Verse[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected index
  const resultsContainerRef = useRef<HTMLDivElement>(null); // Ref for the results container
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryParams = (newChapter: string, newVerse: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set("chapter", newChapter);
    currentParams.set("verse", newVerse);

    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  useEffect(() => {
    if (activeText) {
      const filteredResults = version.filter((item) =>
        item.text.toLowerCase().includes(activeText.toLowerCase()),
      );
      setResults(filteredResults);
    } else {
      setSearch(false);
      setResults([]);
      setSelectedIndex(null); // Reset selected index
    }
  }, [search, activeText, version]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && activeText) {
        setSearch(true);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === null ? 0 : Math.min(prevIndex + 1, results.length - 1),
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === null ? results.length - 1 : Math.max(prevIndex - 1, 0),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeText, results.length]);

  useEffect(() => {
    if (selectedIndex !== null && resultsContainerRef.current) {
      const selectedItem = resultsContainerRef.current.querySelector(
        `.result-item-${selectedIndex}`,
      );

      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: "nearest", // Ensure item stays within the visible area
          behavior: "smooth", // Smooth scroll
        });
      }
    }
  }, [selectedIndex]);

  const getSurroundingText = (text: string, match: string, chars: number) => {
    const matchIndex = text.toLowerCase().indexOf(match.toLowerCase());
    if (matchIndex === -1) return text;

    const start = Math.max(0, matchIndex - chars);
    const end = Math.min(text.length, matchIndex + match.length + chars);

    const beforeMatch = text.slice(start, matchIndex);
    const matchedText = text.slice(matchIndex, matchIndex + match.length);
    const afterMatch = text.slice(matchIndex + match.length, end);

    return (
      <>
        {start > 0 && "..."}
        {beforeMatch}
        <span className="font-bold">{matchedText}</span>
        {afterMatch}
        {end < text.length && "..."}
      </>
    );
  };

  return (
    <div
      onBlur={() => {
        setSearch(false);
        setSelectedIndex(null);
      }}
      className="lg:w-1/2 w-3/4 z-10 sticky top-8 flex flex-col items-center justify-start"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setActiveText(e.target.value);
            setSearch(false);
          }}
          onClick={() => activeText && setSearch(true)}
          className="w-full rounded-lg bg-primary-foreground p-2 px-4 text-sm border border-primary/10 shadow-sm pr-10 outline-none"
        />
        <button onClick={() => setSearch(true)}>
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary/40 w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {search && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-12 bg-primary-foreground border rounded-lg shadow-sm w-full p-2 text-sm overflow-y-scroll"
          >
            <p className="text-xs font-semibold text-primary/40 w-full border-b border-primary/5 pb-1">
              Results
            </p>
            <div className="h-[300px]" ref={resultsContainerRef}>
              {results.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center text-primary/40">
                  No results found
                </div>
              ) : (
                <div>
                  {results.map((result: Verse, index: number) => (
                    <div
                      onClick={() =>
                        updateQueryParams(
                          result.chapter,
                          result.verse.toString(),
                        )
                      }
                      className={`py-4 px-2 border-b border-primary/10 hover:cursor-pointer hover:bg-secondary/50 ${
                        selectedIndex === index ? "bg-secondary/50" : ""
                      } result-item-${index}`}
                      key={index}
                    >
                      <p className="font-bold">
                        {result.book} {result.chapter}:{result.verse}
                      </p>
                      <p>
                        {getSurroundingText(result.text, activeText || "", 50)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
