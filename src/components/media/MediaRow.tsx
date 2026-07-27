"use client";

import MediaCard, { MediaCardProps } from "@/components/media/MediaCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaRowProps {
  title: string;
  cards: MediaCardProps[];
}

export default function MediaRow({ title, cards }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-6 space-y-3 relative group">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl text-zinc-900 dark:text-zinc-100 px-4 md:px-8">
        {title}
      </h2>

      <button
        onClick={() => handleScroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 h-10 w-10 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/90 shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-4 md:px-8 py-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {cards.map((card) => (
          <div key={card.id} className="flex-none snap-start">
            <MediaCard {...card} />
          </div>
        ))}
      </div>

      <button
        onClick={() => handleScroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 h-10 w-10 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/90 shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}
