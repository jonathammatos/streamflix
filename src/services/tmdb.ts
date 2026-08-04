import { MediaCardProps } from "@/components/media/MediaCard";
import { wait } from "next/dist/lib/wait";

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

export async function getSeriesFiltradas(filtros: FiltrosBusca): Promise<{
  results: any[];
  totalPages: number;
}> {
  const {
    page = 1,
    sort_by = "popularity.desc",
    with_genres,
    ...outrosFiltros
  } = filtros || {};

  //cria parametros de busca
  const params = new URLSearchParams({
    language: "pt-BR",
    page: String(page),
    sort_by,
    ...(with_genres ? { with_genres } : {}),
  });

  Object.entries(outrosFiltros).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  //chama a rota
  const res = await fetch(
    `${BASE_URL}/discover/tv?${params.toString()}`,
    fetchOptions,
  );

  if (!res.ok) throw new Error("Erro ao buscar séries filtradas");

  const data = await res.json();

  return {
    results: data.results.map((item: any) => mapToMediaCard(item, "Série")),
    totalPages: data.total_pages,
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

//pegar links dos trailers

export async function getDetalhesMidia(tipo: string, id: number | string) {
  // Converte qualquer variação ("filme", "Série", "Desenho", "serie") para o padrão aceito pelo TMDB ("movie" ou "tv")
  const tipoNormalizado = tipo?.toLowerCase() || "";
  const tipoTmdb =
    tipoNormalizado === "filme" || tipoNormalizado === "movie" ? "movie" : "tv";

  const url = `${BASE_URL}/${tipoTmdb}/${id}?language=pt-BR&append_to_response=videos`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar detalhes da mídia");

  const data = await res.json();

  const trailer = data.videos?.results?.find(
    (vid: any) => vid.type === "Trailer" && vid.site === "YouTube",
  );

  return {
    ...data,
    trailerKey: trailer ? trailer.key : null,
  };
}
