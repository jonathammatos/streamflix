"use client";

import { useEffect, useState } from "react";
import { getSeriesFiltradas, FiltrosBusca } from "@/services/tmdb";
import { FiltrosBar } from "@/components/media/FiltrosBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MediaRow from "@/components/media/MediaRow";
import MediaCard from "@/components/media/MediaCard";

export default function PaginaSeries() {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [filtros, setFiltros] = useState<FiltrosBusca>({
    page: 1,
    sort_by: "popularity.desc",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function carregarLancamentos() {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        const dataPassada = new Date();
        dataPassada.setMonth(dataPassada.getMonth() - 6);
        const seisMesesAtras = dataPassada.toISOString().split("T")[0];

        const data = await getSeriesFiltradas({
          sort_by: "popularity.desc",
          "primary_release_date.gte": seisMesesAtras,
          "primary_release_date.lte": hoje,
          page: 1,
        });
        const comCapa = data.results.filter(
          (item: any) => item.posterUrl && !item.posterUrl.includes("Sem+Capa"),
        );
        setLancamentos(comCapa);
      } catch (error) {
        console.error("Erro ao carregar lançamentos: ", error);
      }
    }

    carregarLancamentos();
  }, []);

  {
    /*Filtrar Series*/
  }

  useEffect(() => {
    async function carregarSeries() {
      setLoading(true);
      try {
        const data = await getSeriesFiltradas(filtros);
        const comCapa = data.results.filter(
          (item: any) => item.posterUrl && !item.posterUrl.includes("Sem+Capa"),
        );
        setSeries(comCapa);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao carregar Series:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarSeries();
  }, [filtros]);

  const handleFilterChange = (novosFiltros: FiltrosBusca) => {
    setFiltros(novosFiltros);
  };

  const paginaAtual = filtros.page || 1;

  {
    /* Botões de Paginação*/
  }
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setFiltros({ ...filtros, page: paginaAtual - 1 });
    }
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPages) {
      setFiltros({ ...filtros, page: paginaAtual + 1 });
    }
  };

  return (
    <>
      <Header />
      <main className="w-full px-4 md:px-8 py-4 text-white bg-zinc-950 min-h-screen">
        {lancamentos.length > 0 && (
          <section className="mb-8">
            <MediaRow title="lançamentos" cards={lancamentos} />
          </section>
        )}
        {/* Barra de Filtros */}
        <section className="my-6">
          <h2 className="text-xl font-semibold mb-2">Filtrar Catálogo</h2>
          <FiltrosBar onFilterChange={handleFilterChange} />
        </section>

        {/* Grid de Filmes Filtrados */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Carregando filmes...
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Nenhum filme encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 my-6">
            {series.map((serie) => (
              <MediaCard key={serie.id} {...serie} />
            ))}
          </div>
        )}
        {mounted && (
          <div className="flex justify-center items-center gap-4 my-8">
            <button
              onClick={irParaPaginaAnterior}
              disabled={Boolean(paginaAtual <= 1 || loading)}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Anterior
            </button>

            <span className="text-gray-400">
              Página <strong className="text-white">{paginaAtual}</strong> de{" "}
              {totalPages}
            </span>

            <button
              onClick={irParaProximaPagina}
              disabled={Boolean(paginaAtual >= totalPages || loading)}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
