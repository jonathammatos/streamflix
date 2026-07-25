import Header from "@/components/layout/Header";

import Button from "@/components/common/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <section className="relative h-[500px] w-full flex items-end p-8 bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-0"></div>

        <div className="relative z-10 max-w-xl space-y-4">
          <h1 className="text-4xl font-extrabold text-white">
            Título do Destaque
          </h1>
          <p className="text-zinc-300 text-sm">
            Sinopse curta da série ou filme em destaque...
          </p>
          <div className="flex gap-4">
            <Button variant="primary">Assistir</Button>
            <Button variant="secondary">Informações</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
