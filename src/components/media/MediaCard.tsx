import Image from "next/image";
import Link from "next/link";

export interface MediaCardProps {
  id: string | number;
  title: string;
  posterUrl: string;
  mediaType: string;
}

export default function MediaCard({
  id,
  title,
  posterUrl,
  mediaType,
}: MediaCardProps) {
  const imagemSegura =
    posterUrl && posterUrl.trim() !== ""
      ? posterUrl
      : "https://placehold.co/500x750/18181b/71717a?text=Sem+Capa";

  const tipoNormalizado = mediaType?.toString().toLowerCase() || "";
  const isFilme = tipoNormalizado === "filme" || tipoNormalizado === "movie";
  const tipoUrl = isFilme ? "filme" : "serie";

  return (
    <Link href={`/detalhes/${tipoUrl}/${id}`}>
      <div className="relative group/card w-36 md:w-44 lg:w-52 flex-none cursor-pointer">
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 bg-zinc-900">
          <Image
            src={imagemSegura}
            alt={title || "Capa do item"}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
            sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
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
    </Link>
  );
}
