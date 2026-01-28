import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, History, User, HelpCircle, LogOut } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setUserName("Configurar Supabase");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("nome_completo")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil do usuário:", profileError);
        setUserName(user.email ?? "Aluno");
        return;
      }

      setUserName(profile?.nome_completo || user.email || "Aluno");
    };

    loadUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    if (!supabase) {
      navigate("/login");
      return;
    }

    supabase.auth.signOut().finally(() => {
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="SRC" 
        showBack={false}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-lg mx-auto">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Olá, {userName ?? "Carregando..."}
            </h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo ao Sistema de Registro de Capacitações
            </p>
          </div>

          {/* Action cards */}
          <div className="space-y-4">
            {/* Primary action - Trainings */}
            <Link 
              to="/aluno/capacitacao"
              className="card-elevated p-6 flex items-center gap-4 group"
            >
              <div className="p-4 rounded-xl gradient-student">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-foreground text-lg group-hover:text-student transition-colors">
                  Capacitações
                </h2>
                <p className="text-sm text-muted-foreground">
                  Iniciar ou continuar suas capacitações
                </p>
              </div>
            </Link>

            {/* History */}
            <Link 
              to="/aluno/historico"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-muted">
                <History className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground group-hover:text-student transition-colors">
                  Histórico
                </h3>
                <p className="text-sm text-muted-foreground">
                  Certificados e registros anteriores
                </p>
              </div>
            </Link>

            {/* Profile */}
            <Link 
              to="/aluno/revisar-dados"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-muted">
                <User className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground group-hover:text-student transition-colors">
                  Meus dados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Atualizar informações cadastrais
                </p>
              </div>
            </Link>

            {/* Support */}
            <div className="card-elevated p-5 flex items-center gap-4 group cursor-pointer">
              <div className="p-3 rounded-lg bg-muted">
                <HelpCircle className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Suporte
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dúvidas? Entre em contato com o NEP
                </p>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="card-institutional p-5 flex items-center gap-4 w-full text-left hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-lg bg-muted">
                <LogOut className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-muted-foreground">
                  Sair
                </h3>
                <p className="text-sm text-muted-foreground">
                  Encerrar sessão
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
