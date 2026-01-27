import { Link } from "react-router-dom";

interface FooterLightProps {
  showTerms?: boolean;
}

export function FooterLight({ showTerms = false }: FooterLightProps) {
  return (
    <footer className="py-6 px-4 text-center">
      <p className="text-sm text-muted-foreground">
        Prefeitura Municipal de Paulínia • NEP
      </p>
      {showTerms && (
        <div className="mt-2 flex items-center justify-center gap-3 text-sm">
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
      )}
    </footer>
  );
}
