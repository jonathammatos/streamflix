"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getFilmesFiltrados, FiltrosBusca } from "@/services/tmdb";
import MediaCatalogLayout from "@/components/media/MediaCatalogLayout";

export default function PaginaFilmes() {
  const [lancamentos, setLancamentos] = useState<any[]>([]);

  const [filmes, setFilmes] = useState<any[]>([]);
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

        const data = await getFilmesFiltrados({
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
    /*Filtrar filmes*/
  }

  useEffect(() => {
    async function carregarFilmes() {
      setLoading(true);
      try {
        const data = await getFilmesFiltrados(filtros);
        const comCapa = data.results.filter(
          (item: any) => item.posterUrl && !item.posterUrl.includes("Sem+Capa"),
        );
        setFilmes(comCapa);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao carregar filmes:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarFilmes();
  }, [filtros]);

  return (
    <>
      <Header />

      <MediaCatalogLayout
        lancamentos={lancamentos}
        midias={filmes}
        totalPages={totalPages}
        loading={loading}
        mounted={mounted}
        filtros={filtros}
        setFiltros={setFiltros}
        tipoMidia="filmes"
      />

      <Footer />
    </>
  );
}
