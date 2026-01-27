import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Shield, Users } from "lucide-react";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import logoNep from "@/assets/logo-nep.jpg";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  type DesiredRole = "student" | "admin" | "manager";

  const signInWithSupabase = async (desiredRole: DesiredRole) => {
    if (!email || !password) {
      alert("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message || "Erro ao fazer login.");
        return;
      }

      // Buscar usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Erro ao obter usuário autenticado.");
        return;
      }

      // Buscar papéis do usuário
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("papel")
        .eq("usuario_id", user.id);

      if (rolesError) {
        console.error("Erro ao carregar papéis do usuário:", rolesError);
        alert("Erro ao carregar permissões do usuário.");
        return;
      }

      const userRoles = (roles ?? []).map((r: any) => r.papel as string);

      // Lógica de redirecionamento por papel
      // 1) Fluxo aluno: sempre permite, independente dos papéis
      if (desiredRole === "student") {
        navigate("/aluno/dashboard");
        return;
      }

      // 2) Fluxo admin: só entra se tiver papel admin
      if (desiredRole === "admin") {
        if (userRoles.includes("admin")) {
          navigate("/admin/dashboard");
        } else {
          alert("Você não tem permissão de administrador.");
        }
        return;
      }

      // 3) Fluxo gestor: entra se tiver papel manager OU admin
      if (desiredRole === "manager") {
        if (userRoles.includes("manager") || userRoles.includes("admin")) {
          navigate("/gestor/dashboard");
        } else {
          alert("Você não tem permissão de gestor.");
        }
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginStudent = async () => {
    await signInWithSupabase("student");
  };

  const handleLoginAdmin = async () => {
    await signInWithSupabase("admin");
  };

  const handleLoginManager = async () => {
    await signInWithSupabase("manager");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with logo */}
      <header className="py-8 px-4 flex justify-center">
        <img
          src={logoNep}
          alt="NEP - Núcleo de Educação Permanente em Saúde"
          className="w-28 h-auto"
        />
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8">
        <div className="container max-w-md mx-auto">
          <div className="card-institutional p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Entrar
            </h1>
            <p className="text-muted-foreground mb-6">
              Faça seu acesso e vamos aprender juntos
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <InputField
                label="E-mail"
                type="email"
                placeholder="Digite aqui seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-right">
                <Link 
                  to="/recuperar-senha" 
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              {/* Role buttons */}
              <div className="space-y-3 pt-4">
                <ButtonRole 
                  variant="student" 
                  fullWidth 
                  onClick={handleLoginStudent}
                  type="button"
                >
                  <GraduationCap className="w-5 h-5" />
                  Entrar como aluno
                </ButtonRole>

                <ButtonRole 
                  variant="admin" 
                  fullWidth 
                  onClick={handleLoginAdmin}
                  type="button"
                >
                  <Shield className="w-5 h-5" />
                  Entrar como administrador
                </ButtonRole>

                <ButtonRole 
                  variant="manager" 
                  fullWidth 
                  onClick={handleLoginManager}
                  type="button"
                >
                  <Users className="w-5 h-5" />
                  Entrar como gestor
                </ButtonRole>
              </div>
            </form>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
              Ao criar ou fazer login em uma conta, você concorda com os{" "}
              <Link to="/termos" className="text-primary hover:underline">
                Termos de Serviço
              </Link>{" "}
              e a{" "}
              <Link to="/termos" className="text-primary hover:underline">
                Política de Privacidade
              </Link>{" "}
              e confirma que está autorizado a fazê-lo em seu próprio nome ou em nome de sua organização.
            </p>
          </div>

          {/* Create account link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Ainda não tem registro?{" "}
              <Link to="/cadastro" className="text-primary font-medium hover:underline">
                Criar nova conta
              </Link>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Apenas para alunos/colaboradores.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
