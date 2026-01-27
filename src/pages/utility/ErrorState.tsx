import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonRole } from "@/components/ui/button-role";

export default function ErrorState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Erro inesperado</h1>
        <p className="text-muted-foreground mb-6">Ocorreu um erro. Tente novamente mais tarde.</p>
        <ButtonRole variant="primary" asChild>
          <Link to="/">Voltar ao início</Link>
        </ButtonRole>
      </div>
    </div>
  );
}
