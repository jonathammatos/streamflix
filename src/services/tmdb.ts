import { MediaCardProps } from "@/components/media/MediaCard";

const BASE_URL = "https://api.themoviedb.org/3";

const TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

const fetchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

export interface FiltrosBusca {
  page?: number;
  with_genres?: string;
  primary_release_year?: string;
  sort_by?: string;
  with_original_language?: string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
}

export interface Genero {
  id: number;
  name: string;
}

export async function getGeneros(): Promise<Genero[]> {
  const res = await fetch(
    `${BASE_URL}/genre/movie/list?language=pt-BR`,
    fetchOptions,
  );
  if (!res.ok) throw new Error("Falha ao carregar gêneros");

  const data = await res.json();
  return data.genres;
}

function mapToMediaCard(
  item: any,
  mediaType: "filme" | "Série" | "Desenho",
): MediaCardProps {
  return {
    id: item.id.toString(),
    title: item.title || item.name,
    posterUrl: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://placehold.co/500x750/18181b/71717a?text=Sem+Capa",
    mediaType: mediaType,
  };
}

export async function getFilmesFiltrados(filtros: FiltrosBusca = {}) {
  const params = new URLSearchParams({
    language: "pt-BR",
    page: (filtros.page || 1).toString(),
    sort_by: filtros.sort_by || "popularity.desc",
  });

  if (filtros.with_genres) params.append("with_genres", filtros.with_genres);

  if (filtros.primary_release_year)
    params.append("primary_release_year", filtros.primary_release_year);

  if (filtros.with_original_language)
    params.append("with_original_language", filtros.with_original_language);

  const res = await fetch(
    `${BASE_URL}/discover/movie?${params.toString()}`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Erro ao carregar filmes filtrados");

  const data = await res.json();

  return {
    results: (data.results || []).map((item: any) =>
      mapToMediaCard(item, "filme"),
    ),
    totalPages: data.total_pages || 1,
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
