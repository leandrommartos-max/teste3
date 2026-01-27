import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoNep from "@/assets/logo-nep.jpg";

interface TopbarStickyProps {
  title: string;
  showBack?: boolean;
  showLogout?: boolean;
  backTo?: string;
  onLogout?: () => void;
}

export function TopbarSticky({ 
  title, 
  showBack = true, 
  showLogout = true, 
  backTo,
  onLogout 
}: TopbarStickyProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="topbar-sticky">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <img 
            src={logoNep} 
            alt="NEP - Núcleo de Educação Permanente em Saúde" 
            className="h-10 w-auto"
          />
          <h1 className="font-display font-semibold text-foreground text-lg">
            {title}
          </h1>
        </div>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
