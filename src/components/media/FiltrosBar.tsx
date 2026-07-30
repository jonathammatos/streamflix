"use client";

import { useEffect, useState } from "react";
import { getGeneros, Genero, FiltrosBusca } from "@/services/tmdb";

interface FiltrosBarProps {
  onFilterChange: (novosFiltros: FiltrosBusca) => void;
}

export function FiltrosBar({ onFilterChange }: FiltrosBarProps) {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [filtros, setFiltros] = useState<FiltrosBusca>({
    with_genres: "",
    primary_release_year: "",
    sort_by: "popularity.desc",
  });

  useEffect(() => {
    getGeneros()
      .then(setGeneros)
      .catch((err) => console.error("Erro ao buscar gêneros:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const atualizados = { ...filtros, [name]: value, page: 1 };
    setFiltros(atualizados);
    onFilterChange(atualizados);
  };

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 50 }, (_, index) => anoAtual - index);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-900 rounded-lg text-white my-4">
      {/* Select de Gêneros */}
      <select
        name="with_genres"
        value={filtros.with_genres}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
      >
        <option value="">Todos os Gêneros</option>
        {generos.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Select de Ano */}
      <select
        name="primary_release_year"
        value={filtros.primary_release_year}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
      >
        <option value="">Todos os Anos</option>
        {anos.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>

      {/* Select de Ordenação */}
      <select
        name="sort_by"
        value={filtros.sort_by}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
      >
        <option value="popularity.desc">Mais Populares</option>
        <option value="vote_average.desc">Melhor Avaliados</option>
        <option value="primary_release_date.desc">Lançamentos Recentes</option>
      </select>
    </div>
  );
}
