import Header from "@/components/layout/Header";
import HeroBanner from "@/components/media/HeroBanner";
import MediaRow from "@/components/media/MediaRow";
import { MediaCardProps } from "@/components/media/MediaCard";

export default function Home() {
  const todasAsMidias: MediaCardProps[] = [
    /* ... dados do TMDB ... */
  ];

  const series = todasAsMidias.filter((item) => item.mediaType === "Série");
  const desenhos = todasAsMidias.filter((item) => item.mediaType === "Desenho");
  const filmes = todasAsMidias.filter((item) => item.mediaType === "filme");

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />
      <HeroBanner />

      <MediaRow title="Séries em Alta" cards={series} />
      <MediaRow title="Desenhos e Animes" cards={desenhos} />
      <MediaRow title="Filmes Recomendados" cards={filmes} />
    </main>
  );
}
