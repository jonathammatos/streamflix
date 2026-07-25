import Link from "next/link";

export default function Header() {
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

      {/* Área do Usuário Padrão */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          CT
        </div>
        <span className="hidden sm:inline text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Cidadão Teste
        </span>
      </div>
    </header>
  );
}
