import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import logoNep from "@/assets/logo-nep.jpg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual only - would show success toast
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="py-8 px-4 flex justify-center">
        <img
          src={logoNep}
          alt="NEP - Núcleo de Educação Permanente em Saúde"
          className="w-24 h-auto"
        />
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8 flex items-start justify-center pt-8">
        <div className="container max-w-md mx-auto">
          <div className="card-institutional p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Recuperar acesso
            </h1>
            <p className="text-muted-foreground mb-6">
              Informe seu e-mail institucional
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail institucional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="pt-2 space-y-3">
                <ButtonRole variant="primary" fullWidth type="submit">
                  Enviar
                </ButtonRole>

                <ButtonRole variant="ghost" fullWidth asChild>
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para login
                  </Link>
                </ButtonRole>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Se necessário, contate o NEP.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4">
        <p className="text-sm text-muted-foreground text-center">
          Prefeitura Municipal de Paulínia • NEP
        </p>
      </footer>
    </div>
  );
}
