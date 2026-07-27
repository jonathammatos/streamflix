import MediaCard, { MediaCardProps } from "@/components/media/MediaCard";

interface MediaRowProps {
  title: string;
  cards: MediaCardProps[];
}

export default function MediaRow({ title, cards }: MediaRowProps) {
  return (
    <section className="my-6 space-y-3">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl text-zinc-900 dark:text-zinc-100 px-4 md:px-8">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 py-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {cards.map((card) => (
          <div key={card.id} className="flex-none snap-start">
            <MediaCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}
