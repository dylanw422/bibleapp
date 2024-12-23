"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl my-4 font-bold">Bible App</h1>
      <div className="space-x-4">
        <Button onClick={() => router.push("/bible/kjv/1")}>Get Started</Button>
        <Button>Info</Button>
      </div>
    </div>
  );
}
