"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

        if (token) {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?language=pt-BR&query=${encodeURIComponent(searchQuery)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
              },
            },
          );
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <Link
        href="/"
        className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white"
      >
        Stream<span className="text-purple-600 dark:text-purple-500">Flix</span>
      </Link>

      {/* Navegação Principal (Visível apenas em desktop) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
        <Link
          href="/"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Início
        </Link>
        <Link
          href="/filmes"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Filmes
        </Link>
        <Link
          href="/series"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Séries
        </Link>
        <Link
          href="/favoritos"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Minha Lista
        </Link>
      </nav>

      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 p-5 flex flex-col gap-4 text-zinc-300 font-medium shadow-2xl transition-all duration-200">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            Início
          </Link>
          <Link
            href="/filmes"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            Filmes
          </Link>
          <Link
            href="/series"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            Séries
          </Link>
          <Link
            href="/favoritos"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-white transition-colors"
          >
            Minha Lista
          </Link>
        </nav>
      )}

      {/* Área do Usuário Padrão */}
      <div className="flex items-center gap-3">
        {/* Botão de Busca */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Buscar"
          className="text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white p-1 transition-colors"
        >
          <Search size={22} />
        </button>

        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          CT
        </div>
        <span className="hidden sm:inline text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Cidadão Teste
        </span>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-zinc-300 hover:text-white p-2 focus:outline-none"
          aria-label="Abrir Menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Modal de Busca */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
            {/* Barra de Entrada da Busca */}
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3 px-2">
              <Search className="text-zinc-400 flex-none" size={22} />
              <input
                type="text"
                placeholder="Busque por títulos, gêneros ou atores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-base md:text-lg"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="py-4 max-h-96 overflow-y-auto flex flex-col gap-2">
              {isLoading ? (
                <div className="py-12 text-center text-zinc-400 text-sm">
                  Buscando...
                </div>
              ) : searchQuery.trim() === "" ? (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  Digite o nome de um filme ou série...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/detalhes/${item.id}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
                  >
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-500">
                        Sem foto
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">
                        {item.title || item.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {item.media_type === "tv" ? "Série" : "Filme"} •{" "}
                        {(item.release_date || item.first_air_date || "").slice(
                          0,
                          4,
                        )}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-400 text-sm">
                  Nenhum resultado encontrado para "
                  <span className="text-white">{searchQuery}</span>".
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
