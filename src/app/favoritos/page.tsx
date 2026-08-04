"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/button";

interface Favorito {
  id: string;
  movie_id: string;
  title: string;
  poster_path: string;
}

export default function PaginaFavoritos() {
  const supabase = createClient();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("favoritos")
          .select("*")
          .eq("user_id", user.id);

        if (error) console.error("Erro ao buscar favoritos:", error);
        else setFavoritos(data || []);
      } finally {
        setLoading(false);
      }
    }

    carregarFavoritos();
  }, []);

  async function handleRemover(e: React.MouseEvent, movieId: string) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

    if (!error) {
      setFavoritos((prev) => prev.filter((item) => item.movie_id !== movieId));
    } else {
      console.error("Erro ao remover:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Carregando seus favoritos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>

        {favoritos.length === 0 ? (
          <p className="text-zinc-400">
            Você ainda não salvou nenhum filme ou série nos favoritos.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoritos.map((item) => (
              <Link
                key={item.id}
                href={`/detalhes/filme/${item.movie_id}`}
                className="group relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:scale-105 transition-transform duration-200"
              >
                <Button
                  onClick={(e) => handleRemover(e, item.movie_id)}
                  variant="secondary"
                  className="absolute top-2 right-2 z-10 !p-2 !rounded-full bg-black/70 hover:bg-red-600 text-zinc-300 hover:text-white border-none opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Remover dos favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 bg-zinc-800 flex items-center justify-center p-4 text-center text-sm">
                    {item.title}
                  </div>
                )}
                <div className="p-3 bg-zinc-900/90">
                  <h2 className="font-semibold text-sm truncate">
                    {item.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
