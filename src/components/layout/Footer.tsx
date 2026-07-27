import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 text-sm py-12 px-4 md:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Identidade da Aplicação */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-wider">
            Stream
            <span className="text-purple-600 dark:text-purple-500">Flix</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            Seu catálogo completo de filmes, séries e animações em um só lugar.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold mb-3 text-xs uppercase tracking-wider">
            Navegação
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href="/"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/filmes"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Filmes
              </Link>
            </li>
            <li>
              <Link
                href="/series"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Séries
              </Link>
            </li>
            <li>
              <Link
                href="/favoritos"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Minha Lista
              </Link>
            </li>
          </ul>
        </div>

        {/* Informações Legais */}
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold mb-3 text-xs uppercase tracking-wider">
            Legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Termos de Uso
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Política de Privacidade
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Ajuda e FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Atribuição da API (Exigência do TMDB) */}
        <div className="space-y-3">
          <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold text-xs uppercase tracking-wider">
            Fonte de Dados
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Este produto utiliza a API do TMDB, mas não é endossado ou
            certificado pelo TMDB.
          </p>
          <span className="inline-block px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] font-mono text-purple-600 dark:text-purple-400">
            TMDB API Enabled
          </span>
        </div>
      </div>

      {/* Linha de Copyright */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} StreamFlix. Todos os direitos reservados.
        </p>
        <p className="text-[11px]">Desenvolvido com Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
