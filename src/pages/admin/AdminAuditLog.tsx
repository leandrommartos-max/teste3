import { useState } from "react";
import { Search, Download } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const eventTypes = [
  { value: "", label: "Todos os eventos" },
  { value: "login", label: "Login" },
  { value: "capacitacao", label: "Capacitação" },
  { value: "usuario", label: "Usuário" },
  { value: "sistema", label: "Sistema" },
];

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "all", label: "Todo o período" },
];

const auditLogs = [
  {
    id: 1,
    timestamp: "26/01/2026 14:32:15",
    actor: "Maria da Silva Santos",
    action: "Concluiu capacitação",
    context: "Segurança do Paciente v2.0",
  },
  {
    id: 2,
    timestamp: "26/01/2026 14:28:03",
    actor: "João Carlos Pereira",
    action: "Acessou dossiê",
    context: "Colaborador: Ana Paula Oliveira",
  },
  {
    id: 3,
    timestamp: "26/01/2026 13:45:22",
    actor: "Roberta Mendes",
    action: "Criou nova capacitação",
    context: "NR-32 v1.5",
  },
  {
    id: 4,
    timestamp: "26/01/2026 12:15:08",
    actor: "Sistema",
    action: "Backup automático",
    context: "Base de dados principal",
  },
  {
    id: 5,
    timestamp: "26/01/2026 11:30:45",
    actor: "Carlos Eduardo Lima",
    action: "Login realizado",
    context: "IP: 192.168.1.100",
  },
];

export default function AdminAuditLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("30d");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Log de auditoria" 
        backTo="/admin/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Info banner - READ ONLY */}
          <div className="p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Registro imutável:</strong> Este log é somente leitura e não pode ser editado, excluído ou ocultado. 
              Todas as atividades são registradas automaticamente para fins de auditoria institucional.
            </p>
          </div>

          {/* Filters */}
          <div className="card-institutional p-4 mb-6">
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <SelectField 
                options={eventTypes}
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                placeholder="Tipo de evento"
              />
              <SelectField 
                options={periodOptions}
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-institutional pl-10"
                />
              </div>
            </div>
          </div>

          {/* Audit log entries */}
          <div className="space-y-3 mb-6">
            {auditLogs.map((log) => (
              <div key={log.id} className="card-institutional p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground font-mono">{log.timestamp}</span>
                      <span className="text-foreground font-medium">•</span>
                      <span className="text-foreground font-medium">{log.actor}</span>
                    </div>
                    <p className="text-foreground mt-1">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.context}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export button */}
          <ButtonRole variant="outline" fullWidth>
            <Download className="w-4 h-4" />
            Exportar log
          </ButtonRole>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
