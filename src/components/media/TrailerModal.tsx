"use client";

interface TrailerModalProps {
  isOpen: boolean;
  trailerKey: string | null;
  onClose: () => void;
}

export default function TrailerModal({
  isOpen,
  trailerKey,
  onClose,
}: TrailerModalProps) {
  if (!isOpen || !trailerKey) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Botão para fechar o modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-zinc-800/90 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Fechar ✕
        </button>

        {/* O vídeo do YouTube rodando em tela cheia */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
          title="Trailer Oficial"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
