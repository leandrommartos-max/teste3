import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
}
