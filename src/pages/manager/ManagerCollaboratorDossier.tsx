import { FileText, Award, ClipboardCheck, Eye } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { ButtonRole } from "@/components/ui/button-role";

const trainingRecords = [
  {
    id: 1,
    name: "Segurança do Paciente",
    version: "v2.0",
    status: "concluido",
    completedAt: "15/01/2024",
  },
  {
    id: 2,
    name: "NR-32 - Segurança e Saúde no Trabalho",
    version: "v1.5",
    status: "concluido",
    completedAt: "10/12/2023",
  },
  {
    id: 3,
    name: "LGPD na Saúde",
    version: "v1.0",
    status: "pendente",
    completedAt: null,
  },
];

export default function ManagerCollaboratorDossier() {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "concluido":
        return <span className="chip-success">Concluído</span>;
      case "pendente":
        return <span className="chip-warning">Pendente</span>;
      case "atraso":
        return <span className="chip-danger">Em atraso</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Dossiê do colaborador" 
        backTo="/gestor/aderencia"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-2xl mx-auto">
          {/* Collaborator identity - NO CPF for managers */}
          <div className="card-institutional p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground font-bold">
                AP
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Ana Paula Oliveira
                </h2>
                <p className="text-muted-foreground">Enfermeira • UTI</p>
              </div>
            </div>
          </div>

          {/* Training records */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Registros de capacitações</h3>
            
            {trainingRecords.map((record) => (
              <div key={record.id} className="card-institutional p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{record.name}</h4>
                    <p className="text-sm text-muted-foreground">{record.version}</p>
                  </div>
                  {getStatusChip(record.status)}
                </div>

                {record.completedAt && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Concluído em: {record.completedAt}
                  </p>
                )}

                {record.status === "concluido" && (
                  <div className="flex flex-wrap gap-2">
                    <ButtonRole variant="outline" size="sm">
                      <Award className="w-4 h-4" />
                      Certificado
                    </ButtonRole>
                    <ButtonRole variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                      Termo de ciência
                    </ButtonRole>
                    <ButtonRole variant="outline" size="sm">
                      <ClipboardCheck className="w-4 h-4" />
                      Resumo do quiz
                    </ButtonRole>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
