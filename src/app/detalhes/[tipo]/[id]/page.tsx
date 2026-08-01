"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetalhesMidia } from "@/services/tmdb";

export default function PaginaDetalhes() {
  const { tipo, id } = useParams();

  const [midia, setMidia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rodandoVideo, setRodandoVideo] = useState(false);
  const [trailerKey, setTrainerKey] = useState<string | null>(null);

  //efeito de carregar vídeo
  useEffect(() => {
    async function carregarDados() {
      if (!id || !tipo) return;

      setLoading(true);
      const tipoMidia = Array.isArray(tipo) ? tipo[0] : tipo;
      const idMidia = Array.isArray(id) ? id[0] : id;

      //transforma os dados da API em string
      const dados = await getDetalhesMidia(tipoMidia, idMidia);

      setMidia(dados);

      if (dados?.videos?.results?.length > 0) {
        const trailerOficial = dados.videos.results.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube",
        );

        if (trailerOficial) {
          setTrainerKey(trailerOficial.key);
        } else {
          const qualuerVideo = dados.videos.results.find(
            (vid: any) => vid.site === "YouTube",
          );
          if (qualuerVideo) setTrainerKey(qualuerVideo.key);
        }
      }

      setLoading(false);
    }
    carregarDados();
  }, [id, tipo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!midia) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Conteúdo não encontrado.
      </div>
    );
  }

  const tituloDaMidia = midia.title || midia.name;

  const dataLancamento = midia.release_date || midia.first_air_date;
  const anoLancamento = dataLancamento ? dataLancamento.split("-")[0] : "N/A";

  const backdropUrl = midia.backdrop_path
    ? `https://image.tmdb.org/t/p/original${midia.backdrop_path}`
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-16">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-end">
        {/*A Imagem de Fundo e o Gradiente */}
        <div className="absolute inset-0 w-full h-full">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={tituloDaMidia}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}

          {/* O Gradiente que escurece a imagem na parte de baixo */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        {/* Camada 2: O Texto (Título e Ano) */}
        <div className="relative z-10 px-6 md:px-16 pb-12 w-full max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
            {tituloDaMidia}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-zinc-300 font-medium mb-6">
            <span className="bg-zinc-800 px-3 py-1 rounded text-white font-bold">
              {anoLancamento}
            </span>
          </div>

          <p className="text-zinc-200 text-sm md:text-lg max-w-3xl leading-relaxed mt-4">
            {midia.overview || "Nenhuma sinopse."}
          </p>

          {/* Botão para abrir o trailer */}
          <div className="mt-6">
            {trailerKey && (
              <button
                onClick={() => setRodandoVideo(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded hover:bg-zinc-300 transition-colors"
              >
                ▶ Assistir Trailer
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
