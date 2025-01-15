import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TextAnimate } from "../ui/text-animate";

export function Hero() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-1/2 p-4 space-y-4 py-48">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold text-center"
      >
        Dive Deeper into Scripture with Powerful Study Tools
      </motion.h1>
      <TextAnimate animation="blurInUp" by="word" className="text-center">
        Unlock profound insights into the Word of God with our advanced Bible
        study platform. Compare translations, explore interlinear texts, take
        personalized notes, and reference scripture seamlessly—all in one place.
      </TextAnimate>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Button onClick={() => router.push("/bible/kjv/1")}>
          Start Your Journey
        </Button>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </motion.div>
    </div>
  );
}
