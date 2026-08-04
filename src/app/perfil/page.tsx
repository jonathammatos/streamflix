"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/button";
import { User, Mail, LogOut, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaginaPerfil() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [supabase]);

  async function handleSair() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        {user ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl space-y-6">
            <div className="flex items-center space-x-4 border-b border-zinc-800 pb-6">
              <div className="w-16 h-16 bg-purple-950/50 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Conta Conectada</h2>
                <p className="text-zinc-400 text-sm flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-purple-400" /> {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/favoritos">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 w-full sm:w-auto border-purple-500/30 hover:border-purple-500 hover:bg-purple-950/30 text-zinc-200"
                >
                  <Heart className="w-4 h-4 text-purple-400" /> Ver Meus
                  Favoritos
                </Button>
              </Link>

              <Button
                onClick={handleSair}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 w-full sm:w-auto border-none"
              >
                <LogOut className="w-4 h-4" /> Sair da Conta
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-4">
            <p className="text-zinc-400">Você não está conectado no momento.</p>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                Fazer Login
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
