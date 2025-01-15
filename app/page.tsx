"use client";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <Hero />
    </div>
  );
}
