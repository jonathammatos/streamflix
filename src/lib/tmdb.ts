const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchFromTMDB(endpoint: string) {
  if (!API_KEY) {
    throw new Error(
      "A chave da API do TMDB não está configurada no arquivo .env.local",
    );
  }

  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar dados do TMDB: ${res.statusText}`);
  }

  return res.json();
}
