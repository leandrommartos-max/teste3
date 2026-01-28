import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Upload } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { supabase } from "@/lib/supabaseClient";

const gestores = [
  { value: "joao", label: "João Carlos" },
  { value: "maria", label: "Maria Santos" },
];

const versoes = [
  { value: "1.0", label: "v1.0" },
  { value: "1.1", label: "v1.1" },
];

const instituicoes = [{ value: "hospital_municipal", label: "Hospital Municipal" }];

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

const TRAININGS_TABLE = "capacitacoes";
const STORAGE_BUCKET = "capacitacoes-assets";

const tabs = [
  { id: "basic", label: "Básico" },
  { id: "media", label: "Mídia" },
  { id: "audience", label: "Público-alvo" },
  { id: "content", label: "Material Técnico de Referência" },
  { id: "quiz", label: "Avaliação" },
  { id: "term", label: "Termo" },
  { id: "publish", label: "Publicação" },
];

type QuizQuestion = {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correct: "a" | "b" | "c" | "";
};

export default function AdminTrainingCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("basic");

  // Basic
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceManager, setReferenceManager] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [version, setVersion] = useState("");

  // Media
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState("");

  // Audience
  const [institution, setInstitution] = useState("");
  const [sector, setSector] = useState("");
  const [professionalCategory, setProfessionalCategory] = useState("");
  const [roleFunction, setRoleFunction] = useState("");
  const [employmentBond, setEmploymentBond] = useState("");
  const [completionDeadline, setCompletionDeadline] = useState("");
  const [requirementLevel, setRequirementLevel] = useState("");
  const [audienceMessage, setAudienceMessage] = useState("");

  // Content
  const [referencePdfFile, setReferencePdfFile] = useState<File | null>(null);

  // Term
  const [termModel, setTermModel] = useState("");
  const [termText, setTermText] = useState("");

  // Save
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: 1, question: "", optionA: "", optionB: "", optionC: "", correct: "" },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((q) => q.id)) + 1 : 1,
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        correct: "",
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (
    id: number,
    field: keyof Omit<QuizQuestion, "id">,
    value: string
  ) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const uploadFile = async (file: File, folder: string) => {
    const safeName = file.name.replaceAll(" ", "_");
    const filePath = `${folder}/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;
    return filePath;
  };

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const coverImagePath = coverImageFile
        ? await uploadFile(coverImageFile, "cover-images")
        : null;

      const referencePdfPath = referencePdfFile
        ? await uploadFile(referencePdfFile, "reference-materials")
        : null;

      const payload = {
        title,
        description,
        reference_manager: referenceManager,
        duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        instructor_name: instructorName,
        version,
        cover_image_path: coverImagePath,
        video_link: videoLink,
        institution,
        sector,
        professional_category: professionalCategory,
        role_function: roleFunction,
        employment_bond: employmentBond,
        completion_deadline: completionDeadline || null,
        requirement_level: requirementLevel,
        audience_message: audienceMessage,
        reference_pdf_path: referencePdfPath,
        quiz_questions: questions,
        term_model: termModel,
        term_text: termText,
        status,
      };

      const { error } = await supabase.from(TRAININGS_TABLE).insert([payload]);
      if (error) throw error;

      navigate("/admin/capacitacoes");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar capacitação.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky title="Nova capacitação" backTo="/admin/capacitacoes" />

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
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-6">
            {/* BASIC */}
            {activeTab === "basic" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Informações básicas</h3>

                <InputField
                  label="Título da capacitação *"
                  placeholder="Ex: Segurança do Paciente"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                  <textarea
                    className="input-institutional min-h-24 resize-none"
                    placeholder="Descreva os objetivos da capacitação..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Gestor de referência"
                    options={gestores}
                    placeholder="Selecione"
                    value={referenceManager}
                    onChange={(event) => setReferenceManager(event.target.value)}
                  />

                  <InputField
                    label="Duração (minutos)"
                    type="number"
                    placeholder="45"
                    value={durationMinutes}
                    onChange={(event) => setDurationMinutes(event.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nome do instrutor"
                    placeholder="Nome do instrutor responsável"
                    value={instructorName}
                    onChange={(event) => setInstructorName(event.target.value)}
                  />

                  <SelectField
                    label="Versão"
                    options={versoes}
                    placeholder="Selecione"
                    value={version}
                    onChange={(event) => setVersion(event.target.value)}
                  />
                </div>
              </div>
            )}

            {/* MEDIA */}
            {activeTab === "media" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Mídia</h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Imagem de capa
                  </label>

                  <label className="border-2 border-dashed border-border rounded-lg p-8 min-h-[240px] flex flex-col items-center justify-center text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => setCoverImageFile(event.target.files?.[0] ?? null)}
                    />

                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Clique ou arraste para enviar</p>

                    {coverImageFile && (
                      <p className="text-xs text-muted-foreground mt-2">{coverImageFile.name}</p>
                    )}
                  </label>
                </div>

                <InputField
                  label="Link do vídeo (YouTube)"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoLink}
                  onChange={(event) => setVideoLink(event.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  O vídeo será exibido junto ao material de estudo.
                </p>
              </div>
            )}

            {/* AUDIENCE */}
            {activeTab === "audience" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Público-alvo</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Instituição"
                    options={instituicoes}
                    placeholder="Selecione"
                    value={institution}
                    onChange={(event) => setInstitution(event.target.value)}
                  />
                  <SelectField
                    label="Setor"
                    options={setores}
                    placeholder="Todos"
                    value={sector}
                    onChange={(event) => setSector(event.target.value)}
                  />
                  <SelectField
                    label="Categoria profissional"
                    options={categoriasProf}
                    placeholder="Todas"
                    value={professionalCategory}
                    onChange={(event) => setProfessionalCategory(event.target.value)}
                  />
                  <SelectField
                    label="Função"
                    options={funcoes}
                    placeholder="Todas"
                    value={roleFunction}
                    onChange={(event) => setRoleFunction(event.target.value)}
                  />
                  <SelectField
                    label="Vínculo"
                    options={vinculos}
                    placeholder="Todos"
                    value={employmentBond}
                    onChange={(event) => setEmploymentBond(event.target.value)}
                  />
                  <InputField
                    label="Prazo para conclusão"
                    type="date"
                    value={completionDeadline}
                    onChange={(event) => setCompletionDeadline(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nível de obrigatoriedade
                  </label>
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
                        <input
                          type="radio"
                          name="requirement"
                          className="w-4 h-4 text-admin"
                          checked={requirementLevel === opt.value}
                          onChange={() => setRequirementLevel(opt.value)}
                        />
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
                    value={audienceMessage}
                    onChange={(event) => setAudienceMessage(event.target.value)}
                  />
                </div>
              </div>
            )}

            {/* CONTENT */}
            {activeTab === "content" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Conteúdo</h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Material de estudo (PDF)
                  </label>

                  <label className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer block">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(event) => setReferencePdfFile(event.target.files?.[0] ?? null)}
                    />

                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Clique ou arraste para enviar</p>

                    {referencePdfFile && (
                      <p className="text-xs text-muted-foreground mt-2">{referencePdfFile.name}</p>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* QUIZ */}
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
                            type="button"
                            onClick={() => removeQuestion(q.id)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <InputField
                        placeholder="Digite a pergunta..."
                        value={q.question}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "question", event.target.value)
                        }
                      />

                      <InputField
                        placeholder="Opção A"
                        value={q.optionA}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "optionA", event.target.value)
                        }
                      />
                      <InputField
                        placeholder="Opção B"
                        value={q.optionB}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "optionB", event.target.value)
                        }
                      />
                      <InputField
                        placeholder="Opção C"
                        value={q.optionC}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "optionC", event.target.value)
                        }
                      />

                      <SelectField
                        label="Resposta correta"
                        options={[
                          { value: "a", label: "Opção A" },
                          { value: "b", label: "Opção B" },
                          { value: "c", label: "Opção C" },
                        ]}
                        placeholder="Selecione"
                        value={q.correct}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "correct", event.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TERM */}
            {activeTab === "term" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Termo de ciência</h3>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Pré-visualização
                  </label>
                  <div className="flex items-center justify-center h-48 bg-muted rounded-lg p-4 overflow-y-auto">
                    <p className="text-center text-sm text-muted-foreground">
                      Elabore aqui o Termo de Ciência com validade institucional, que será assinado
                      pelo participante após a capacitação.
                    </p>
                  </div>
                </div>

                <SelectField
                  label="Modelo de termo"
                  options={termosModelos}
                  placeholder="Selecione um modelo"
                  value={termModel}
                  onChange={(event) => setTermModel(event.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Texto do termo
                  </label>
                  <textarea
                    className="input-institutional min-h-32 resize-none"
                    placeholder="Digite o termo de ciência..."
                    value={termText}
                    onChange={(event) => setTermText(event.target.value)}
                  />
                </div>
              </div>
            )}

            {/* PUBLISH */}
            {activeTab === "publish" && (
              <div className="card-institutional p-6 space-y-4">
                <h3 className="font-display font-semibold text-foreground">Publicação</h3>

                <p className="text-muted-foreground">
                  Revise todas as informações antes de publicar a capacitação.
                </p>

                {saveError && <p className="text-sm text-destructive">{saveError}</p>}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <ButtonRole
                    variant="outline"
                    fullWidth
                    onClick={() => navigate("/admin/capacitacoes")}
                    className="hover:bg-red-600 hover:text-white hover:border-red-600"
                    disabled={isSaving}
                  >
                    Cancelar
                  </ButtonRole>

                  <ButtonRole
                    variant="outline"
                    fullWidth
                    onClick={() => handleSave("draft")}
                    disabled={isSaving}
                  >
                    Salvar rascunho
                  </ButtonRole>

                  <ButtonRole
                    variant="admin"
                    fullWidth
                    onClick={() => handleSave("published")}
                    disabled={isSaving}
                    className="!bg-[#50B771] !border-[#50B771] !text-white hover:!bg-[#50B771]/90 hover:!border-[#50B771]"
                  >
                    Publicar
                  </ButtonRole>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
