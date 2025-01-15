"use client";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <Hero />
    </div>
  );
}
