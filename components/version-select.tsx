import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

import { useRouter, usePathname } from "next/navigation";

const versions = ["NKJV", "KJV", "NIV", "ESV", "NLT"];

export function VersionSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const currentVersion = pathname.split("/")[2].toUpperCase();

  const handleVersionChange = (version: string) => {
    // Extract the base URL path (book and chapter)
    const currentBookChapter = pathname.split("/").slice(3).join("/");
    const url = window.location.href;
    const fragment = url.includes("#") ? url.split("#")[1] : "";

    router.push(
      `/bible/${version.toLowerCase()}/${currentBookChapter}${fragment ? `#${fragment}` : ""}`,
    );
  };

  return (
    <div id="select" className="w-1/2 flex items-center justify-end">
      <Select onValueChange={handleVersionChange}>
        <SelectTrigger className="bg-primary-foreground">
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
  );
}
