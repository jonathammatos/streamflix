"use client";

import Button from "@/components/ui/button";
import PlayerButton from "@/components/media/PlayerButton";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroBannerProps {
  title: string;
  posterUrl: string;
  overview?: string;
  tipo: string;
  id: string | number;
}

export default function HeroBanner({
  title,
  posterUrl,
  overview,
  tipo,
  id,
}: HeroBannerProps) {
  const router = useRouter();

  return (
    <section className="relative h-[500px] w-full flex items-end p-8 bg-zinc-900 overflow-hidden">
      {/* Imagem de Fundo (Poster) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{ backgroundImage: `url(${posterUrl})` }}
      ></div>

      {/* Gradiente de escurecimento para leitura */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-0"></div>

      <div className="relative z-10 max-w-xl space-y-4">
        <h1 className="text-4xl font-extrabold text-white">{title}</h1>
        <p className="text-zinc-300 text-sm line-clamp-3">
          {overview ||
            "Explore este título em destaque no catálogo do StreamFlix."}
        </p>
        <div className="flex gap-4">
          <PlayerButton mediaType={tipo} mediaId={id} />

          <Button
            variant="secondary"
            onClick={() => {
              const tipoDestino =
                tipo === "filme"
                  ? "movie"
                  : tipo === "serie"
                    ? "tv"
                    : tipo || "movie";
              router.push(`/detalhes/${tipoDestino}/${id}`);
            }}
          >
            <Info className="w-5 h-5 strokeWidth={2.5}" />
            Info
          </Button>
        </div>
      </div>
    </section>
  );
}
