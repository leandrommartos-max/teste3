import { WifiOff } from "lucide-react";

export default function OfflineState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Sem conexão</h1>
        <p className="text-muted-foreground">Verifique sua conexão com a internet e tente novamente.</p>
      </div>
    </div>
  );
}
