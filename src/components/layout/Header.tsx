"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";

import { useRouter } from "next/navigation";
import { User as UserIcon, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const modalRef = useRef<HTMLDivElement>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Pega o usuário logado atualmente
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 2. Escuta mudanças de autenticação em tempo real
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Debounce de 400ms para não fazer uma requisição a cada tecla digitada
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Ajuste a URL abaixo para a sua rota de API da TMDB
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <Link
        href="/"
        className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white"
      >
        Stream<span className="text-purple-600 dark:text-purple-500">Flix</span>
      </Link>

      {/* Navegação Principal desktop */}
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

      {/* Área do Usuário Dinâmica */}
      <div className="flex items-center gap-4 relative">
        {/* Botão de Busca */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Buscar"
          className="text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white p-1 transition-colors"
        >
          <Search size={22} />
        </button>

        {/* Botão do Perfil / Menu Flutuante */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-sm transition cursor-pointer"
            aria-label="Menu do Usuário"
          >
            {user ? user.email?.[0].toUpperCase() : "U"}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-xs text-zinc-400">Logado como</p>
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/perfil"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
                  >
                    Modificar Dados / Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition text-left w-full cursor-pointer"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-center border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">
                      Bem-vindo(a)!
                    </p>
                    <p className="text-xs text-zinc-400">Entre na sua conta.</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-center py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition shadow-sm block"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-center py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition block"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

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
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl"
          >
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
