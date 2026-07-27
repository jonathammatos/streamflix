import { MediaCardProps } from "@/components/media/MediaCard";

const BASE_URL = "https://api.themoviedb.org/3";

const TOKEN = process.env.TMDB_ACCESS_TOKEN;

const fetchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

function mapToMediaCard(
  item: any,
  mediaType: "filme" | "Série" | "Desenho",
): MediaCardProps {
  return {
    id: item.id.toString(),
    title: item.title || item.name,
    posterUrl: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "/placeholder.png",
    mediaType: mediaType,
  };
}

export async function getSeriesEmAlta(): Promise<MediaCardProps[]> {
  const res = await fetch(
    `${BASE_URL}/trending/tv/week?language=pt-BR`,
    fetchOptions,
  );
  if (!res.ok) throw new Error("Erro ao buscar séries em alta");
  const data = await res.json();

  return data.results.map((item: any) => mapToMediaCard(item, "Série"));
}

export async function getDesenhosEAnimes(): Promise<MediaCardProps[]> {
  const res = await fetch(
    `${BASE_URL}/discover/tv?with_genres=16&language=pt-BR&sort_by=vote_count.desc`,
    fetchOptions,
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Erro TMDB Desenhos/Animes:", res.status, errorBody);
    throw new Error("Erro ao buscar desenhos e animes");
  }

  const data = await res.json();
  return data.results.map((item: any) => mapToMediaCard(item, "Desenho"));
}

export async function getFilmesRecomendados(): Promise<MediaCardProps[]> {
  const res = await fetch(
    `${BASE_URL}/movie/popular?language=pt-BR`,
    fetchOptions,
  );
  if (!res.ok) throw new Error("Erro ao buscar filmes");
  const data = await res.json();

  return data.results.map((item: any) => mapToMediaCard(item, "filme"));
}
