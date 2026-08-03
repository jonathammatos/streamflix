"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDetalhesMidia } from "@/services/tmdb";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // O Next.js entrega os valores da URL aqui:
  const mediaType = params.mediaType;
  const mediaId = params.mediaId;

  useEffect(() => {
    async function carregarTrailer() {
      if (!mediaId || !mediaType) return;
      try {
        setLoading(true);
        // Garante que o tipo é string
        const tipoStr = Array.isArray(mediaType) ? mediaType[0] : mediaType;
        const idStr = Array.isArray(mediaId) ? mediaId[0] : mediaId;

        const tipoFormatado =
          tipoStr === "filme" ? "movie" : tipoStr === "serie" ? "tv" : tipoStr;
        const dados = await getDetalhesMidia(tipoFormatado, idStr);

        const trailer =
          dados?.videos?.results?.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube",
          ) ||
          dados?.videos?.results?.find((vid: any) => vid.site === "YouTube");

        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarTrailer();
  }, [mediaId, mediaType]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* O botão de voltar flutuante */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 bg-zinc-800 text-white p-2 rounded"
      >
        Voltar
      </button>

      {/* "janela" que roda o vídeo (Iframe) */}
      {trailerKey ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
          title="Player de Vídeo"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
          <p>Nenhum vídeo disponível no momento.</p>
        </div>
      )}
    </div>
  );
}
