"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { books } from "@/data/books";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AppSidebar({ version }: { version: string }) {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="">
        {books.map((book, index) => {
          return (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem className="border-0" value={book.name}>
                <AccordionTrigger className="px-4 py-2">
                  <div>{book.name}</div>
                </AccordionTrigger>
                <AccordionContent className="">
                  <div className="grid grid-cols-5">
                    {book.chapters.map((chapter, chapterIndex) => (
                      <Button
                        onClick={() =>
                          router.push(
                            `/bible/${version.toLowerCase()}/${index + 1}?chapter=${chapterIndex + 1}`,
                          )
                        }
                        variant={"ghost"}
                        className="text-xs"
                        key={chapterIndex}
                      >
                        {chapter}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
