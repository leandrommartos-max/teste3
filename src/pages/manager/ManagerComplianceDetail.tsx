import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const setores = [
  { value: "", label: "Todos os setores" },
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
];

const capacitacoes = [
  { value: "", label: "Todas as capacitações" },
  { value: "seguranca_paciente", label: "Segurança do Paciente" },
  { value: "nr32", label: "NR-32" },
  { value: "lgpd", label: "LGPD na Saúde" },
];

const funcoes = [
  { value: "", label: "Todas as funções" },
  { value: "enfermeiro", label: "Enfermeiro(a)" },
  { value: "tecnico_enfermagem", label: "Técnico(a) de Enfermagem" },
  { value: "medico", label: "Médico(a)" },
];

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "concluido", label: "Concluído" },
  { value: "pendente", label: "Pendente" },
  { value: "atraso", label: "Em atraso" },
];

const collaborators = [
  {
    id: 1,
    name: "Ana Paula Oliveira",
    function: "Enfermeira",
    sector: "UTI",
    trainings: [
      { name: "NR-32", status: "atraso" },
      { name: "LGPD", status: "pendente" },
    ],
  },
  {
    id: 2,
    name: "Carlos Eduardo Silva",
    function: "Técnico de Enfermagem",
    sector: "UTI",
    trainings: [
      { name: "Segurança do Paciente", status: "concluido" },
    ],
  },
  {
    id: 3,
    name: "Mariana Santos Costa",
    function: "Médica",
    sector: "Pronto Atendimento",
    trainings: [
      { name: "NR-32", status: "pendente" },
    ],
  },
  {
    id: 4,
    name: "Ricardo Ferreira Lima",
    function: "Enfermeiro",
    sector: "UTI",
    trainings: [
      { name: "Segurança do Paciente", status: "concluido" },
      { name: "NR-32", status: "concluido" },
      { name: "LGPD", status: "concluido" },
    ],
  },
];

export default function ManagerComplianceDetail() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusChip = (status: string, name: string) => {
    switch (status) {
      case "concluido":
        return <span className="chip-success text-xs">{name} • Concluído</span>;
      case "pendente":
        return <span className="chip-warning text-xs">{name} • Pendente</span>;
      case "atraso":
        return <span className="chip-danger text-xs">{name} • Em atraso</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Aderência" 
        backTo="/gestor/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Filters */}
          <div className="card-institutional p-4 mb-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <SelectField options={setores} placeholder="Setor" />
              <SelectField options={capacitacoes} placeholder="Capacitação" />
              <SelectField options={funcoes} placeholder="Cargo/Função" />
              <SelectField options={statusOptions} placeholder="Status" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-institutional pl-10"
              />
            </div>
          </div>

          {/* Collaborators list */}
          <div className="space-y-4 mb-6">
            {collaborators.map((collab) => (
              <div key={collab.id} className="card-institutional p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{collab.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {collab.function} • {collab.sector}
                    </p>
                    
                    {/* Training labels */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {collab.trainings.map((t, idx) => (
                        <span key={idx}>
                          {getStatusChip(t.status, t.name)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/gestor/dossie/${collab.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-manager text-white hover:bg-manager/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Dossiê
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonRole variant="outline" fullWidth>
              <Download className="w-4 h-4" />
              Exportar lista
            </ButtonRole>
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
