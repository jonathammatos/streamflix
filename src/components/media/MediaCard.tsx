import Image from "next/image";

export interface MediaCardProps {
  id: string | number;
  title: string;
  posterUrl: string;
  mediaType: "filme" | "Série" | "Desenho" | "Live-Action";
}

export default function MediaCard({
  id,
  title,
  posterUrl,
  mediaType,
}: MediaCardProps) {
  return (
    <div className="relative group w-36 md:w-44 lg:w-52 flex-none cursor-pointer">
      {/* Container com proporção de poster (2:3) */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-zinc-300">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <span className="text-white font-medium text-sm truncate">
            {title}
          </span>

          {mediaType && (
            <span className="text-zinc-300 text-xs mt-1 font-semibold">
              {mediaType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
