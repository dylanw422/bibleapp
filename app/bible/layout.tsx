"use client";
import { AppSidebar } from "@/components/app-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";

const versions = ["NKJV", "KJV", "NIV"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const currentVersion = pathname.split("/")[2].toUpperCase();

  // Handle the version change
  const handleVersionChange = (version: string) => {
    // Extract the base URL path (book and chapter)
    const currentBookChapter = pathname.split("/").slice(3).join("/");
    const url = window.location.href;
    const fragment = url.split("#")[1];

    router.push(
      `/bible/${version.toLowerCase()}/${currentBookChapter}${fragment ? `#${fragment}` : ""}`,
    );
  };

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
