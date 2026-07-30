import { FiltrosBusca } from "@/services/tmdb";
import { FiltrosBar } from "@/components/media/FiltrosBar";
import MediaCard from "@/components/media/MediaCard";
import MediaRow from "@/components/media/MediaRow";

interface MediaCatalogLayoutProps {
  lancamentos: any[];
  midias: any[]; // Filmes ou Séries
  totalPages: number;
  loading: boolean;
  mounted: boolean;
  filtros: FiltrosBusca;
  setFiltros: (filtros: FiltrosBusca) => void;
  tipoMidia: "filmes" | "séries"; // Usado apenas para os textos de loading/vazio
}

export default function MediaCatalogLayout({
  lancamentos,
  midias,
  totalPages,
  loading,
  mounted,
  filtros,
  setFiltros,
  tipoMidia,
}: MediaCatalogLayoutProps) {
  const paginaAtual = filtros.page || 1;

  // Lógica dos Filtros e Paginação (isolada aqui no componente)
  const handleFilterChange = (novosFiltros: FiltrosBusca) => {
    setFiltros(novosFiltros);
  };

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
    <main className="w-full px-4 md:px-8 py-4 text-white bg-zinc-950 min-h-screen">
      {/* Lançamentos */}
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

      {/* Grid de Cards */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          Carregando {tipoMidia}...
        </div>
      ) : midias.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Nenhum {tipoMidia === "filmes" ? "filme" : "série"} encontrado com os
          filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 my-6">
          {midias.map((item) => (
            <MediaCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* Paginação */}
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
  );
}
