import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { BookCopy, Scroll, Pencil, BookOpenCheck } from "lucide-react";
import { Scripture } from "./bible-page";

export function Tools({
  position,
  verse,
  onClose,
}: {
  position: { x: number; y: number; relativeX: number; relativeY: number };
  verse: Scripture | undefined;
  onClose: () => void;
}) {
  const buttons = [
    {
      value: "Compare",
      icon: BookCopy,
    },
    {
      value: "Hebrew / Greek",
      icon: Scroll,
    },
    {
      value: "Add Note",
      icon: Pencil,
    },
    {
      value: "References",
      icon: BookOpenCheck,
    },
  ];

  return (
    <motion.div
      className={`absolute z-20 bg-primary-foreground shadow-md border border-input rounded-lg p-4 pb-0 pr-10 text-sm text-primary`}
      initial={{
        scale: 0,
        opacity: 0,
        top: position.y - 50,
        left: position.x - 200,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        top: position.y,
        left: position.x,
        translateY: position.relativeY < 200 ? "0%" : "-100%",
      }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
    >
      <X
        onClick={onClose}
        className="absolute top-2 right-2 w-4 h-4 cursor-pointer"
      />
      <div className="flex flex-col items-start space-y-2">
        <h1 className="font-bold">
          {verse?.book} {verse?.chapter}
          {":"}
          {verse?.verse}
        </h1>
        {buttons.map((button, index) => (
          <motion.button
            className="text-xs w-full text-start rounded-sm text-primary/80 hover:underline transition py-1"
            key={index}
          >
            <div className="flex items-center">
              <button.icon className="w-3 h-3 mr-2" />
              {button.value}
            </div>
          </motion.button>
        ))}
      </div>
      <p className="text-[10px] text-primary/30 mt-4">{verse?.uuid}</p>
    </motion.div>
  );
}
