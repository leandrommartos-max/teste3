import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Archive, Plus } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const tabs = [
  { id: "basic", label: "Básico" },
  { id: "media", label: "Mídia" },
  { id: "audience", label: "Público-alvo" },
  { id: "content", label: "Conteúdo" },
  { id: "quiz", label: "Avaliação" },
  { id: "term", label: "Termo" },
];

const categorias = [
  { value: "seguranca", label: "Segurança" },
  { value: "qualidade", label: "Qualidade" },
];

const statusOptions = [
  { value: "publicada", label: "Publicada" },
  { value: "rascunho", label: "Rascunho" },
  { value: "arquivada", label: "Arquivada" },
];

export default function AdminTrainingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = () => {
    navigate("/admin/capacitacoes");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Segurança do Paciente" 
        backTo="/admin/capacitacoes"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Header with status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="chip-success">Publicada</span>
              <span className="text-muted-foreground">v2.0</span>
            </div>
            <div className="flex gap-2">
              <ButtonRole variant="outline" size="sm">
                <Plus className="w-4 h-4" />
                Nova versão
              </ButtonRole>
              <ButtonRole variant="ghost" size="sm">
                <Archive className="w-4 h-4" />
                Arquivar
              </ButtonRole>
            </div>
          </div>

          {/* Governance note */}
          <div className="p-4 bg-admin-light rounded-lg mb-6">
            <p className="text-sm text-admin">
              Esta capacitação está publicada. Para alterações estruturais, crie uma nova versão.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-admin text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "basic" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Informações básicas</h3>
              <InputField 
                label="Título da capacitação" 
                defaultValue="Segurança do Paciente" 
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                <textarea 
                  className="input-institutional min-h-24 resize-none" 
                  defaultValue="Esta capacitação aborda os princípios fundamentais de segurança do paciente conforme diretrizes do Ministério da Saúde e OMS."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField label="Categoria" options={categorias} defaultValue="seguranca" />
                <InputField label="Duração (minutos)" type="number" defaultValue="45" />
              </div>
              <InputField label="Nome do instrutor" defaultValue="Dr. Roberto Almeida" />
              <SelectField label="Status" options={statusOptions} defaultValue="publicada" />
            </div>
          )}

          {activeTab === "media" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Mídia</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Vídeo configurado: youtube.com/...</p>
              </div>
            </div>
          )}

          {activeTab === "audience" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Público-alvo</h3>
              <p className="text-muted-foreground">Configurações de público-alvo da capacitação.</p>
            </div>
          )}

          {activeTab === "content" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Conteúdo</h3>
              <p className="text-muted-foreground">Material de estudo e documentos.</p>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Avaliação</h3>
              <p className="text-muted-foreground">Perguntas e respostas do quiz.</p>
            </div>
          )}

          {activeTab === "term" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Termo</h3>
              <p className="text-muted-foreground">Termo de ciência configurado.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <ButtonRole variant="outline" fullWidth onClick={() => navigate("/admin/capacitacoes")}>
              Voltar
            </ButtonRole>
            <ButtonRole variant="admin" fullWidth onClick={handleSave}>
              Salvar alterações
            </ButtonRole>
          </div>
        </div>
      </main>
    </div>
  );
}
