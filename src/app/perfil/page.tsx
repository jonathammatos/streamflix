"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/button";
import { User, Mail, LogOut, Heart, Edit2, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaginaPerfil() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Controle de interface
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  // Estado único para o formulário
  const [originalData, setOriginalData] = useState({ nome: "", email: "" });
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const nomeAtual = user.user_metadata?.full_name || "";
          const emailAtual = user.email || "";

          setOriginalData({ nome: nomeAtual, email: emailAtual });
          setFormData({ nome: nomeAtual, email: emailAtual, senha: "" });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [supabase]);

  const exibirMensagem = (tipo: "sucesso" | "erro", texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 6000);
  };

  const handleCancelar = () => {
    // Restaura os dados originais e sai do modo de edição
    setFormData({ ...originalData, senha: "" });
    setIsEditing(false);
    setMensagem(null);
  };

  const handleSalvar = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nome.trim())
      return exibirMensagem("erro", "O nome não pode ficar em branco.");
    if (!formData.email.trim())
      return exibirMensagem("erro", "O e-mail não pode ficar em branco.");
    if (formData.senha && formData.senha.length < 6)
      return exibirMensagem(
        "erro",
        "A nova senha deve ter no mínimo 6 caracteres.",
      );

    // Descobre o que realmente mudou para enviar ao Supabase
    const updates: any = {};
    if (formData.nome.trim() !== originalData.nome)
      updates.data = { full_name: formData.nome.trim() };
    if (formData.email.trim() !== originalData.email)
      updates.email = formData.email.trim();
    if (formData.senha) updates.password = formData.senha;

    // Se nada mudou, apenas fecha a edição
    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.auth.updateUser(updates);
    setIsSaving(false);

    if (error) {
      exibirMensagem("erro", `Erro ao salvar: ${error.message}`);
    } else {
      let msgSucesso = "Perfil atualizado com sucesso!";
      if (updates.email) {
        msgSucesso +=
          " Verifique a caixa de entrada do novo e antigo e-mail para confirmar a alteração.";
      }

      exibirMensagem("sucesso", msgSucesso);
      setOriginalData({ nome: formData.nome, email: formData.email });
      setFormData((prev) => ({ ...prev, senha: "" })); // Limpa a senha
      setIsEditing(false);

      // Atualiza visualmente o objeto user
      setUser((prev: any) => ({
        ...prev,
        email: updates.email || prev.email,
        user_metadata: {
          ...prev.user_metadata,
          full_name: formData.nome.trim(),
        },
      }));
    }
  };

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
          <div className="space-y-8">
            {/* Cabeçalho do Perfil */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl space-y-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-950/50 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.user_metadata?.full_name || "Usuário"}
                  </h2>
                  <p className="text-zinc-400 text-sm flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-purple-400" /> {user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6 sm:mt-0">
                <Link href="/favoritos">
                  <Button
                    variant="secondary"
                    className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-950/30 text-zinc-200"
                  >
                    <Heart className="w-4 h-4 mr-2 text-purple-400" /> Favoritos
                  </Button>
                </Link>
                <Button
                  onClick={handleSair}
                  className="bg-zinc-800 hover:bg-purple-950/30 text-white border border-zinc-700 hover:border-purple-500/50"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </Button>
              </div>
            </div>

            {mensagem && (
              <div
                className={`p-4 rounded-lg border text-sm font-medium ${
                  mensagem.tipo === "sucesso"
                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                    : "bg-red-500/10 border-red-500/50 text-red-400"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            {/* Formulário Único de Dados Pessoais */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-100">
                  Dados Pessoais
                </h3>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    className="bg-zinc-800 hover:bg-zinc-700 text-sm h-9"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
                  </Button>
                )}
              </div>

              <form onSubmit={handleSalvar} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    />
                  </div>

                  {/* E-mail */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Endereço de E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>

                {/* Senha (Só aparece quando está editando) */}
                {isEditing && (
                  <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                    <label className="text-sm font-medium text-zinc-400">
                      Alterar Senha (Opcional)
                    </label>
                    <input
                      type="password"
                      value={formData.senha}
                      onChange={(e) =>
                        setFormData({ ...formData, senha: e.target.value })
                      }
                      placeholder="Deixe em branco para não alterar"
                      className="w-full md:w-1/2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-600 transition"
                    />
                  </div>
                )}

                {/* Botões de Ação da Edição */}
                {isEditing && (
                  <div className="flex gap-4 pt-6 mt-6 border-t border-zinc-800 flex-col-reverse sm:flex-row justify-end">
                    <Button
                      type="button"
                      onClick={handleCancelar}
                      variant="secondary"
                      disabled={isSaving}
                      className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 border-none"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white border-none"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                )}
              </form>
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
