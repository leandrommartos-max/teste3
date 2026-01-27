import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Archive, Eye } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "publicada", label: "Publicada" },
  { value: "rascunho", label: "Rascunho" },
  { value: "arquivada", label: "Arquivada" },
];

const trainings = [
  {
    id: 1,
    title: "Segurança do Paciente",
    version: "v2.0",
    status: "publicada",
  },
  {
    id: 2,
    title: "NR-32 - Segurança e Saúde no Trabalho",
    version: "v1.5",
    status: "publicada",
  },
  {
    id: 3,
    title: "LGPD na Saúde",
    version: "v1.0",
    status: "publicada",
  },
  {
    id: 4,
    title: "Prevenção de Quedas",
    version: "v1.0",
    status: "rascunho",
  },
];

export default function AdminTrainingCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const getStatusChip = (status: string) => {
    switch (status) {
      case "publicada":
        return <span className="chip-success">Publicada</span>;
      case "rascunho":
        return <span className="chip-warning">Rascunho</span>;
      case "arquivada":
        return <span className="chip-info">Arquivada</span>;
      default:
        return null;
    }
  };

  const filteredTrainings = trainings.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Capacitações" 
        backTo="/admin/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Header with CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Catálogo de Capacitações
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie, publique e versione capacitações institucionais.
              </p>
            </div>
            <ButtonRole variant="admin" asChild>
              <Link to="/admin/capacitacoes/nova">
                <Plus className="w-5 h-5" />
                Nova capacitação
              </Link>
            </ButtonRole>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar capacitação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-institutional pl-10"
              />
            </div>
            <div className="sm:w-48">
              <SelectField
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Training list */}
          <div className="space-y-4">
            {filteredTrainings.map((training) => (
              <div key={training.id} className="card-institutional p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground">{training.title}</h3>
                      {getStatusChip(training.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{training.version}</p>
                  </div>

                  <div className="flex gap-2">
                    <ButtonRole variant="outline" size="sm" asChild>
                      <Link to={`/admin/capacitacoes/${training.id}`}>
                        <Eye className="w-4 h-4" />
                        Abrir
                      </Link>
                    </ButtonRole>
                    <ButtonRole variant="outline" size="sm" asChild>
                      <Link to={`/admin/capacitacoes/${training.id}`}>
                        <Edit className="w-4 h-4" />
                        Editar
                      </Link>
                    </ButtonRole>
                    <ButtonRole variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                      Arquivar
                    </ButtonRole>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
