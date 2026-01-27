import { FileText, Download } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const capacitacoes = [
  { value: "", label: "Todas as capacitações" },
  { value: "seguranca_paciente", label: "Segurança do Paciente" },
  { value: "nr32", label: "NR-32" },
  { value: "lgpd", label: "LGPD na Saúde" },
];

const setores = [
  { value: "", label: "Todos os setores" },
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
];

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "concluido", label: "Concluído" },
  { value: "pendente", label: "Pendente" },
  { value: "atraso", label: "Em atraso" },
];

const periodOptions = [
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "180d", label: "Últimos 6 meses" },
  { value: "365d", label: "Último ano" },
];

const formatOptions = [
  { value: "csv", label: "CSV" },
  { value: "pdf", label: "PDF" },
];

export default function AdminReports() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Relatórios" 
        backTo="/admin/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto space-y-6">
          {/* Report 1 - Compliance by training */}
          <div className="card-institutional p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-admin-light">
                <FileText className="w-6 h-6 text-admin" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">
                  Aderência por capacitação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Relatório detalhado de conclusões por capacitação.
                </p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <SelectField options={capacitacoes} placeholder="Capacitação" />
              <SelectField options={periodOptions} placeholder="Período" />
            </div>
            
            <ButtonRole variant="admin" fullWidth>
              Gerar relatório
            </ButtonRole>
          </div>

          {/* Report 2 - Pending by sector */}
          <div className="card-institutional p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">
                  Pendências por setor
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lista de colaboradores com capacitações pendentes ou em atraso.
                </p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <SelectField options={setores} placeholder="Setor" />
              <SelectField options={statusOptions} placeholder="Status" />
            </div>
            
            <ButtonRole variant="admin" fullWidth>
              Gerar relatório
            </ButtonRole>
          </div>

          {/* Export options */}
          <div className="card-institutional p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Opções de exportação
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SelectField options={formatOptions} defaultValue="csv" />
              </div>
              <ButtonRole variant="outline">
                <Download className="w-4 h-4" />
                Exportar
              </ButtonRole>
            </div>
          </div>

          {/* Audit note */}
          <p className="text-sm text-muted-foreground text-center">
            Geração de relatórios registrada para auditoria institucional.
          </p>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
