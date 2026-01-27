import { Link } from "react-router-dom";
import { BookOpen, Shield, FileCheck, Users } from "lucide-react";
import { ButtonRole } from "@/components/ui/button-role";
import logoNep from "@/assets/logo-nep.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="container max-w-4xl mx-auto flex flex-col items-center">
          <img
            src={logoNep}
            alt="NEP - Núcleo de Educação Permanente em Saúde"
            className="w-32 h-auto mb-4"
          />
          <h1 className="font-display text-3xl font-bold text-primary text-center">
            SRC
          </h1>
          <p className="text-lg text-muted-foreground text-center mt-2 max-w-md">
            Seu espaço institucional para registrar e acompanhar capacitações.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Info cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-institutional p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-student-light">
                  <BookOpen className="w-6 h-6 text-student" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    Por que usar?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registre capacitações com evidências, tenha acesso a certificados e 
                    mantenha seu histórico profissional sempre atualizado.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-manager-light">
                  <Shield className="w-6 h-6 text-manager" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    Como funciona?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse conteúdos, realize avaliações, assine termos e receba 
                    certificados automaticamente após conclusão.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="card-institutional p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Principais recursos
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Certificados digitais</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Gestão de equipes</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Conteúdos multimídia</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Registro seguro e auditável</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <ButtonRole variant="student" fullWidth asChild>
              <Link to="/login">Acessar</Link>
            </ButtonRole>
            <ButtonRole variant="outline" fullWidth asChild>
              <Link to="/cadastro">Criar nova conta</Link>
            </ButtonRole>
          </div>

          {/* Secondary links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link 
              to="/recuperar-senha" 
              className="text-primary hover:underline"
            >
              Recuperar acesso
            </Link>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <Link 
              to="/termos" 
              className="text-primary hover:underline"
            >
              Termos e privacidade
            </Link>
          </div>

          {/* Access note */}
          <div className="card-institutional p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              <Users className="inline w-4 h-4 mr-1 -mt-0.5" />
              Gestores e administradores recebem acesso pelo NEP
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Prefeitura Municipal de Paulínia • NEP
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link 
              to="/termos" 
              className="text-primary hover:underline"
            >
              Termos de Serviço
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/termos" 
              className="text-primary hover:underline"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
