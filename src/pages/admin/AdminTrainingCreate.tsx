import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Upload } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const gestores = [
  { value: "joao", label: "João Carlos" },
  { value: "maria", label: "Maria Santos" },
];

const versoes = [
  { value: "1.0", label: "v1.0" },
  { value: "1.1", label: "v1.1" },
];


const instituicoes = [
  { value: "hospital_municipal", label: "Hospital Municipal" },
];

const setores = [
  { value: "", label: "Todos os setores" },
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
];

const categoriasProf = [
  { value: "", label: "Todas as categorias" },
  { value: "assistencial", label: "Assistencial" },
  { value: "administrativo", label: "Administrativo" },
];

const funcoes = [
  { value: "", label: "Todas as funções" },
  { value: "enfermeiro", label: "Enfermeiro(a)" },
  { value: "tecnico", label: "Técnico(a)" },
];

const vinculos = [
  { value: "", label: "Todos os vínculos" },
  { value: "servidor", label: "Servidor" },
  { value: "terceirizado", label: "Terceirizado" },
];

const termosModelos = [
  { value: "padrao", label: "Termo padrão" },
  { value: "nr32", label: "Termo NR-32" },
];

const tabs = [
  { id: "basic", label: "Básico" },
  { id: "media", label: "Mídia" },
  { id: "audience", label: "Público-alvo" },
  { id: "content", label: "Conteúdo" },
  { id: "quiz", label: "Avaliação" },
  { id: "term", label: "Termo" },
  { id: "publish", label: "Publicação" },
];

export default function AdminTrainingCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [questions, setQuestions] = useState([
    { id: 1, question: "", optionA: "", optionB: "", optionC: "", correct: "" },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, question: "", optionA: "", optionB: "", optionC: "", correct: "" },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    navigate("/admin/capacitacoes");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Nova capacitação" 
        backTo="/admin/capacitacoes"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
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
          <div className="space-y-6">
            {activeTab === "basic" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Informações básicas</h3>
                <InputField label="Título da capacitação *" placeholder="Ex: Segurança do Paciente" />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                  <textarea 
                    className="input-institutional min-h-24 resize-none" 
                    placeholder="Descreva os objetivos da capacitação..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField label="Gestor de referência" options={gestores} placeholder="Selecione" />
                  <InputField label="Duração (minutos)" type="number" placeholder="45" />
                  <SelectField label="Gestor de referência" options={gestores} placeholder="Selecione" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Nome do instrutor" placeholder="Nome do instrutor responsável" />
                  <SelectField label="Versão" options={versoes} placeholder="Selecione" />
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Mídia</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Imagem de capa</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Clique ou arraste para enviar</p>
                  </div>
                </div>
                <InputField 
                  label="Link do vídeo (YouTube)" 
                  placeholder="https://youtube.com/watch?v=..." 
                />
                <p className="text-sm text-muted-foreground">
                  O vídeo será exibido junto ao material de estudo.
                </p>
              </div>
            )}

            {activeTab === "audience" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Público-alvo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField label="Instituição" options={instituicoes} placeholder="Selecione" />
                  <SelectField label="Setor" options={setores} placeholder="Todos" />
                  <SelectField label="Categoria profissional" options={categoriasProf} placeholder="Todas" />
                  <SelectField label="Função" options={funcoes} placeholder="Todas" />
                  <SelectField label="Vínculo" options={vinculos} placeholder="Todos" />
                  <InputField label="Prazo para conclusão" type="date" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Nível de obrigatoriedade</label>
                  <div className="space-y-2">
                    {[
                      { value: "obrigatoria", label: "Obrigatória" },
                      { value: "opcional", label: "Opcional" },
                      { value: "desejavel", label: "Desejável" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                      >
                        <input type="radio" name="requirement" className="w-4 h-4 text-admin" />
                        <span className="text-sm text-foreground">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Mensagem aos colaboradores
                  </label>
                  <textarea 
                    className="input-institutional min-h-20 resize-none" 
                    placeholder="Mensagem opcional para os colaboradores..."
                  />
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Conteúdo</h3>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Material de estudo (PDF)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Clique ou arraste para enviar</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Versões do documento</h4>
                  <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Pré-visualização do vídeo</label>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Nenhum vídeo configurado</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="card-institutional p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">Avaliação</h3>
                  <ButtonRole variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="w-4 h-4" />
                    Adicionar pergunta
                  </ButtonRole>
                </div>

                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Pergunta {idx + 1}</span>
                        {questions.length > 1 && (
                          <button 
                            onClick={() => removeQuestion(q.id)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <InputField placeholder="Digite a pergunta..." />
                      <InputField placeholder="Opção A" />
                      <InputField placeholder="Opção B" />
                      <InputField placeholder="Opção C" />
                      <SelectField 
                        label="Resposta correta" 
                        options={[
                          { value: "a", label: "Opção A" },
                          { value: "b", label: "Opção B" },
                          { value: "c", label: "Opção C" },
                        ]} 
                        placeholder="Selecione" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "term" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Termo de ciência</h3>
                <SelectField 
                  label="Modelo de termo" 
                  options={termosModelos} 
                  placeholder="Selecione um modelo" 
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Pré-visualização</label>
                  <div className="h-48 bg-muted rounded-lg p-4 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                      Selecione um modelo para pré-visualizar o termo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "publish" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Publicação</h3>
                <p className="text-muted-foreground">
                  Revise todas as informações antes de publicar a capacitação.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <ButtonRole variant="outline" fullWidth onClick={handleSave}>
                    Salvar rascunho
                  </ButtonRole>
                  <ButtonRole variant="admin" fullWidth onClick={handleSave}>
                    Publicar
                  </ButtonRole>
                </div>
                
                <ButtonRole variant="ghost" fullWidth onClick={() => navigate("/admin/capacitacoes")}>
                  Cancelar
                </ButtonRole>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
