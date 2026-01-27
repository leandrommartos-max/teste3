import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, FileText, Download, Eye } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "concluido", label: "Concluído" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "pendente", label: "Pendente" },
];

const trainingHistory = [
  {
    id: 1,
    name: "Segurança do Paciente",
    version: "v2.0",
    status: "concluido",
    completedAt: "15/01/2024",
    hasCertificate: true,
  },
  {
    id: 2,
    name: "NR-32 - Segurança e Saúde no Trabalho",
    version: "v1.5",
    status: "concluido",
    completedAt: "10/12/2023",
    hasCertificate: true,
  },
  {
    id: 3,
    name: "LGPD na Saúde",
    version: "v1.0",
    status: "em_andamento",
    completedAt: null,
    hasCertificate: false,
  },
];

export default function StudentTrainingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const getStatusChip = (status: string) => {
    switch (status) {
      case "concluido":
        return <span className="chip-success">Concluído</span>;
      case "em_andamento":
        return <span className="chip-info">Em andamento</span>;
      case "pendente":
        return <span className="chip-warning">Pendente</span>;
      default:
        return null;
    }
  };

  const filteredHistory = trainingHistory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Histórico" 
        backTo="/aluno/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-2xl mx-auto">
          {/* Search and filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar capacitação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-institutional pl-10"
              />
            </div>
            
            <SelectField
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Filtrar por status"
            />
          </div>

          {/* History list */}
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.id} className="card-institutional p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.version}</p>
                  </div>
                  {getStatusChip(item.status)}
                </div>

                {item.completedAt && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Concluído em: {item.completedAt}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                    <Eye className="w-4 h-4" />
                    Ver registro
                  </button>
                  {item.hasCertificate && (
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                      <Download className="w-4 h-4" />
                      Certificado
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma capacitação encontrada.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
