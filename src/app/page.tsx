import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/media/HeroBanner";
import MediaRow from "@/components/media/MediaRow";
import { MediaCardProps } from "@/components/media/MediaCard";

import {
  getSeriesEmAlta,
  getDesenhosEAnimes,
  getFilmesRecomendados,
} from "@/services/tmdb";

export default async function Home() {
  const [filmes, series, desenhos] = await Promise.all([
    getFilmesRecomendados(),
    getSeriesEmAlta(),
    getDesenhosEAnimes(),
  ]);

  const destaque = filmes[0];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />
      <HeroBanner title={destaque.title} posterUrl={destaque.posterUrl} />

      <MediaRow title="Séries em Alta" cards={series} />
      <MediaRow title="Desenhos e Animes" cards={desenhos} />
      <MediaRow title="Filmes Recomendados" cards={filmes} />

      <Footer />
    </main>
  );
}
