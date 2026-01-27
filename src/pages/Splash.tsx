import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import logoNep from "@/assets/logo-nep.jpg";

export default function Splash() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/landing");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center animate-fade-in">
        <img
          src={logoNep}
          alt="NEP - Núcleo de Educação Permanente em Saúde"
          className="w-40 h-auto mb-6"
        />
        <h1 className="font-display text-3xl font-bold text-primary mb-2">
          SRC
        </h1>
        <p className="text-muted-foreground text-center text-lg mb-8">
          Sistema de Registro de Capacitações
        </p>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Conectando...</span>
          </div>
        )}
      </div>
      <footer className="absolute bottom-8 text-center">
        <p className="text-sm text-muted-foreground">
          Prefeitura Municipal de Paulínia • NEP
        </p>
      </footer>
    </div>
  );
}
