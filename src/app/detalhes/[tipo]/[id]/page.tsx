"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetalhesMidia } from "@/services/tmdb";
import PlayerButton from "@/components/media/PlayerButton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrailerModal from "@/components/media/TrailerModal";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/button";
import { Star } from "lucide-react";

//Renderiza pagina com detalhes do filme
export default function PaginaDetalhes() {
  const { tipo, id } = useParams();
  const tipoMidia = Array.isArray(tipo) ? tipo[0] : (tipo ?? "");
  const idMidia = Array.isArray(id) ? id[0] : (id ?? "");
  const [midia, setMidia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const supabase = createClient();
  const [isFavorito, setIsFavorito] = useState(false);

  // Checa se já está favoritado ao carregar
  useEffect(() => {
    async function checarFavorito() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !idMidia) return;

      const { data } = await supabase
        .from("favoritos")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie_id", idMidia)
        .maybeSingle();

      if (data) setIsFavorito(true);
    }
    checarFavorito();
  }, [idMidia]);

  // Função para favoritar / desfavoritar
  async function handleFavorito() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Faça login para favoritar!");

    if (isFavorito) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", idMidia);
      setIsFavorito(false);
    } else {
      await supabase.from("favoritos").insert({
        user_id: user.id,
        movie_id: idMidia,
        title: tituloDaMidia,
        poster_path: midia?.poster_path,
      });
      setIsFavorito(true);
    }
  }

  //

  //efeito de carregar vídeo
  useEffect(() => {
    async function carregarDados() {
      if (
        !idMidia ||
        !tipoMidia ||
        idMidia === "undefined" ||
        tipoMidia === "undefined"
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        //transforma os dados da API em string
        const tipoFormatado =
          tipoMidia === "filme"
            ? "movie"
            : tipoMidia === "serie"
              ? "tv"
              : tipoMidia;

        // Substitua a chamada original por esta (usando tipoFormatado):
        const dados = await getDetalhesMidia(tipoFormatado, idMidia);
        console.log("Retorno do TMDB:", dados);

        if (dados && dados.success === false) {
          setMidia(null);
        } else {
          setMidia(dados);
        }

        if (dados?.videos?.results?.length > 0) {
          const trailerOficial = dados.videos.results.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube",
          );

          if (trailerOficial) {
            setTrailerKey(trailerOficial.key);
          } else {
            const qualuerVideo = dados.videos.results.find(
              (vid: any) => vid.site === "YouTube",
            );
            if (qualuerVideo) setTrailerKey(qualuerVideo.key);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 pb-16">
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

            <div className="flex items-center gap-4">
              <PlayerButton mediaType={tipoMidia} mediaId={idMidia} />

              <Button
                onClick={handleFavorito}
                variant={isFavorito ? "outline" : "secondary"}
                className={
                  isFavorito
                    ? "border-red-600 text-red-500 hover:bg-red-600/10"
                    : ""
                }
              >
                <Star
                  className={`w-5 h-5 ${isFavorito ? "fill-purple-400 text-purple-400" : ""}`}
                />
                {isFavorito ? "Remover dos Favoritos" : "Favoritar"}
              </Button>
            </div>
          </div>
        </section>

        <TrailerModal
          isOpen={modalAberto}
          trailerKey={trailerKey}
          onClose={() => setModalAberto(false)}
        />
      </main>

      <Footer />
    </div>
  );
}
