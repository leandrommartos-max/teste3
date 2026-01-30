import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Trash2, Upload } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { Checkbox } from "@/components/ui/checkbox";
import { InputField } from "@/components/ui/input-field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

const INSTITUTIONS_TABLE = "lk_setor";

const FUNCTIONS_TABLE = "lk_funcao";

const termosModelos = [
  { value: "padrao", label: "Termo padrão" },
  { value: "nr32", label: "Termo NR-32" },
];

const TRAININGS_TABLE = "trainings";
const TRAINING_LOCATIONS_TABLE = "training_locations";
const TRAINING_CATEGORIES_TABLE = "training_professional_categories";
const TRAINING_SECTORS_TABLE = "training_sectors";
const STORAGE_BUCKET = "training-documents";

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
  optionD: string;
  optionE: string;
  correct: "a" | "b" | "c" | "d" | "e" | "";
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
  const [institution, setInstitution] = useState<string[]>([]);
  const [sector, setSector] = useState<string[]>([]);
  const [professionalCategory, setProfessionalCategory] = useState<string[]>([]);
  const [roleFunction, setRoleFunction] = useState("");
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
  const [institutionOptions, setInstitutionOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isInstitutionLoading, setIsInstitutionLoading] = useState(false);
  const [institutionLoadError, setInstitutionLoadError] = useState<string | null>(null);
  const [functionOptions, setFunctionOptions] = useState<{ value: string; label: string }[]>([]);
  const [isFunctionLoading, setIsFunctionLoading] = useState(false);
  const [functionLoadError, setFunctionLoadError] = useState<string | null>(null);
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([
    { value: "", label: "Todos os setores" },
  ]);
  const [isSectorLoading, setIsSectorLoading] = useState(false);
  const [sectorLoadError, setSectorLoadError] = useState<string | null>(null);

  // Quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: 1, question: "", optionA: "", optionB: "", optionC: "", optionD: "", optionE: "", correct: "" },
  ]);

  const hasSupabaseConfig = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    let isMounted = true;

    const fetchInstitutions = async () => {
      setIsInstitutionLoading(true);
      setInstitutionLoadError(null);

      if (!hasSupabaseConfig) {
        if (!isMounted) return;
        setInstitutionLoadError("Configuração do Supabase ausente.");
        setInstitutionOptions([]);
        setIsInstitutionLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from(INSTITUTIONS_TABLE)
        .select("setor_sem_detalhe", { distinct: true })
        .order("setor_sem_detalhe", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setInstitutionLoadError("Não foi possível carregar as instituições.");
        setInstitutionOptions([]);
        setIsInstitutionLoading(false);
        return;
      }

      const uniqueLocals = Array.from(
        new Set(
          data
            ?.map((item) => item.setor_sem_detalhe?.trim())
            .filter((local): local is string => Boolean(local)) ?? []
        )
      );
      const options = uniqueLocals.map((local) => ({ value: local, label: local }));

      setInstitutionOptions(options);
      setIsInstitutionLoading(false);
    };

    fetchInstitutions();

    return () => {
      isMounted = false;
    };
  }, [hasSupabaseConfig]);

  useEffect(() => {
    let isMounted = true;

    const fetchSectors = async () => {
      setIsSectorLoading(true);
      setSectorLoadError(null);

      if (!hasSupabaseConfig) {
        if (!isMounted) return;
        setSectorLoadError("Configuração do Supabase ausente.");
        setSectorOptions([{ value: "", label: "Todos os setores" }]);
        setIsSectorLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from(INSTITUTIONS_TABLE)
        .select("setor")
        .order("setor", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setSectorLoadError("Não foi possível carregar os setores.");
        setSectorOptions([{ value: "", label: "Todos os setores" }]);
        setIsSectorLoading(false);
        return;
      }

      const filteredSectors = Array.from(
        new Set(
          data
            ?.map((item) => item.setor?.trim())
            .filter((setor): setor is string => Boolean(setor))
            .filter((setor) => setor.toLowerCase().includes("hmp")) ?? []
        )
      );

      const options = filteredSectors.map((setor) => ({ value: setor, label: setor }));

      setSectorOptions([...options]);
      setIsSectorLoading(false);
    };

    fetchSectors();

    return () => {
      isMounted = false;
    };
  }, [hasSupabaseConfig]);

  useEffect(() => {
    let isMounted = true;

    const fetchFunctions = async () => {
      setIsFunctionLoading(true);
      setFunctionLoadError(null);

      if (!hasSupabaseConfig) {
        if (!isMounted) return;
        setFunctionLoadError("Configuração do Supabase ausente.");
        setFunctionOptions([]);
        setIsFunctionLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from(FUNCTIONS_TABLE)
        .select("funcao_sem_especialidade", { distinct: true })
        .order("funcao_sem_especialidade", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setFunctionLoadError("Não foi possível carregar as funções.");
        setFunctionOptions([]);
        setIsFunctionLoading(false);
        return;
      }

      const uniqueFunctions = Array.from(
        new Set(
          data
            ?.map((item) => item.funcao_sem_especialidade?.trim())
            .filter((funcao): funcao is string => Boolean(funcao)) ?? []
        )
      );
      const options = uniqueFunctions.map((funcao) => ({ value: funcao, label: funcao }));

      setFunctionOptions([...options]);
      setIsFunctionLoading(false);
    };

    fetchFunctions();

    return () => {
      isMounted = false;
    };
  }, [hasSupabaseConfig]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((q) => q.id)) + 1 : 1,
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        correct: "",
      },
    ]);
  };

  const handleInstitutionToggle = (value: string, checked: boolean) => {
    setInstitution((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleProfessionalCategoryToggle = (value: string, checked: boolean) => {
    setProfessionalCategory((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSectorToggle = (value: string, checked: boolean) => {
    setSector((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
  };

  const institutionLabel = (() => {
    if (institution.length === 0) return "Escolha os locais";
    if (institution.length === 1) {
      const singleInstitution = institution[0];
      return (
        institutionOptions.find((option) => option.value === singleInstitution)?.label ??
        singleInstitution
      );
    }
    return `${institution.length} seleções`;
  })();

  const professionalCategoryLabel = (() => {
    if (professionalCategory.length === 0) return "Escolha as categorias";
    if (professionalCategory.length === 1) {
      const singleCategory = professionalCategory[0];
      return (
        functionOptions.find((option) => option.value === singleCategory)?.label ??
        singleCategory
      );
    }
    return `${professionalCategory.length} seleções`;
  })();

  const sectorLabel = (() => {
    if (sector.length === 0) return "Escolha os setores";
    if (sector.length === 1) {
      const singleSector = sector[0];
      return sectorOptions.find((option) => option.value === singleSector)?.label ?? singleSector;
    }
    return `${sector.length} seleções`;
  })();

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
    const normalizedName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w.-]+/g, "_");
    const safeName = normalizedName || `arquivo_${Date.now()}`;
    const filePath = `${folder}/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;
    return filePath;
  };

  const getSaveErrorMessage = (error: unknown) => {
    if (!error || typeof error !== "object") {
      return "Erro ao salvar capacitação.";
    }

    if ("message" in error && typeof error.message === "string" && error.message.trim()) {
      const message = error.message;
      if (message.includes("Could not find the") && message.includes("column of 'trainings'")) {
        const match = message.match(/'([^']+)' column of 'trainings'/);
        const column = match?.[1];
        return column
          ? `A coluna '${column}' não existe na tabela trainings. Crie essa coluna no Supabase ou rode a migration correspondente.`
          : "Uma coluna usada no cadastro não existe na tabela trainings. Crie a coluna no Supabase ou rode a migration correspondente.";
      }

      const details =
        "details" in error && typeof error.details === "string" && error.details.trim()
          ? ` (${error.details})`
          : "";
      const hint =
        "hint" in error && typeof error.hint === "string" && error.hint.trim()
          ? ` Dica: ${error.hint}`
          : "";
      const code =
        "code" in error && typeof error.code === "string" && error.code.trim()
          ? ` [${error.code}]`
          : "";

      return `${message}${details}${hint}${code}`;
    }

    return "Erro ao salvar capacitação.";
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
        titulo: title,
        descricao: description,
        reference_manager: referenceManager,
        duracao_minutos: durationMinutes ? Number(durationMinutes) : null,
        nome_instrutor: referenceManager,
        instructor_name: instructorName,
        version,
        cover_image_path: coverImagePath,
        link_video: videoLink,
        role_function: roleFunction,
        prazo_conclusao: completionDeadline || null,
        nivel_requisito: requirementLevel,
        audience_message: audienceMessage,
        reference_pdf_path: referencePdfPath,
        quiz_questions: questions,
        term_model: termModel,
        texto_termo: termText,
        status,
      };

      const { data: trainingData, error } = await supabase
        .from(TRAININGS_TABLE)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;

      if (!trainingData?.id) {
        throw new Error("Capacitação criada sem retorno do identificador.");
      }

      const trainingId = trainingData.id;

      if (institution.length > 0) {
        const locationRows = institution.map((location) => ({
          training_id: trainingId,
          location,
        }));

        const { error: locationError } = await supabase
          .from(TRAINING_LOCATIONS_TABLE)
          .insert(locationRows);
        if (locationError) throw locationError;
      }

      if (professionalCategory.length > 0) {
        const categoryRows = professionalCategory.map((category) => ({
          training_id: trainingId,
          category,
        }));

        const { error: categoryError } = await supabase
          .from(TRAINING_CATEGORIES_TABLE)
          .insert(categoryRows);
        if (categoryError) throw categoryError;
      }

      if (sector.length > 0) {
        const sectorRows = sector.map((sectorName) => ({
          training_id: trainingId,
          sector: sectorName,
        }));

        const { error: sectorError } = await supabase
          .from(TRAINING_SECTORS_TABLE)
          .insert(sectorRows);
        if (sectorError) throw sectorError;
      }
      const preparedQuestions = questions
        .map((question) => ({
          question,
          payload: {
            training_id: trainingId,
            question_text: question.question.trim(),
            correct_option: question.correct,
          },
        }))
        .filter(
          (item) => item.payload.question_text && item.payload.correct_option
        );

      if (preparedQuestions.length > 0) {
        const { data: insertedQuestions, error: questionError } = await supabase
          .from("training_questions")
          .insert(preparedQuestions.map((item) => item.payload))
          .select("id");
        if (questionError) throw questionError;

        const optionRows = insertedQuestions.flatMap((insertedQuestion, index) => {
          const { question } = preparedQuestions[index];
          return [
            { key: "a", value: question.optionA },
            { key: "b", value: question.optionB },
            { key: "c", value: question.optionC },
          ]
            .map((option) => ({
              question_id: insertedQuestion.id,
              option_key: option.key,
              option_text: option.value.trim(),
            }))
            .filter((option) => option.option_text);
        });

        if (optionRows.length > 0) {
          const { error: optionError } = await supabase
            .from("training_question_options")
            .insert(optionRows);
          if (optionError) throw optionError;
        }
      }

      navigate("/admin/capacitacoes");
    } catch (error) {
      console.error("Erro ao salvar capacitação:", error);
      const message = getSaveErrorMessage(error);
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

                  <InputField
                    label="Gestor de referência"
                    type="text"
                    placeholder="Nome do Coordenador"
                    value={referenceManager}
                    onChange={(event) => setReferenceManager(event.target.value)}
                  />

                  <InputField
                    label="Nome do instrutor"
                    placeholder="Nome do instrutor responsável"
                    value={instructorName}
                    onChange={(event) => setInstructorName(event.target.value)}
                  />
                               
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Duração (minutos)"
                    type="number"
                    placeholder="45"
                    value={durationMinutes}
                    onChange={(event) => setDurationMinutes(event.target.value)}
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

                  <label className="border-2 border-dashed border-border rounded-lg p-8 min-h-[360px] flex flex-col items-center justify-center text-center cursor-pointer">
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

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Popover>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-foreground">Local</label>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isInstitutionLoading}
                            className={cn(
                              "input-institutional flex items-center justify-between text-left",
                              isInstitutionLoading && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm",
                                institution.length === 0
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {isInstitutionLoading ? "Carregando..." : institutionLabel}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
                          {institutionOptions.length > 0 ? (
                            <div className="max-h-60 space-y-2 overflow-auto">
                              {institutionOptions.map((option) => {
                                const isChecked = institution.includes(option.value);
                                const optionId = `local-option-${option.value.replace(/\s+/g, "-")}`;
                                return (
                                  <label
                                    key={option.value}
                                    htmlFor={optionId}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
                                  >
                                    <Checkbox
                                      id={optionId}
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleInstitutionToggle(option.value, checked === true)
                                      }
                                    />
                                    <span>{option.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="px-2 py-1 text-sm text-muted-foreground">
                              Nenhum local disponível.
                            </p>
                          )}
                        </PopoverContent>
                        {institutionLoadError && (
                          <p className="text-sm text-destructive">{institutionLoadError}</p>
                        )}
                      </div>
                    </Popover>
                    <Popover>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-foreground">
                          Setor (HMP)
                        </label>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isSectorLoading}
                            className={cn(
                              "input-institutional flex items-center justify-between text-left",
                              isSectorLoading && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm",
                                sector.length === 0 ? "text-muted-foreground" : "text-foreground"
                              )}
                            >
                              {isSectorLoading ? "Carregando..." : sectorLabel}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
                          {sectorOptions.length > 0 ? (
                            <div className="max-h-60 space-y-2 overflow-auto">
                              {sectorOptions.map((option) => {
                                const isChecked = sector.includes(option.value);
                                const optionId = `setor-option-${option.value.replace(/\s+/g, "-")}`;
                                return (
                                  <label
                                    key={option.value}
                                    htmlFor={optionId}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
                                  >
                                    <Checkbox
                                      id={optionId}
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleSectorToggle(option.value, checked === true)
                                      }
                                    />
                                    <span>{option.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="px-2 py-1 text-sm text-muted-foreground">
                              Nenhum setor disponível.
                            </p>
                          )}
                        </PopoverContent>
                        {sectorLoadError && (
                          <p className="text-sm text-destructive">{sectorLoadError}</p>
                        )}
                      </div>
                    </Popover>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Popover>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-foreground">
                          Categoria profissional
                        </label>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isFunctionLoading}
                            className={cn(
                              "input-institutional flex items-center justify-between text-left",
                              isFunctionLoading && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm",
                                professionalCategory.length === 0
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {isFunctionLoading ? "Carregando..." : professionalCategoryLabel}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
                          {functionOptions.length > 0 ? (
                            <div className="max-h-60 space-y-2 overflow-auto">
                              {functionOptions.map((option) => {
                                const isChecked = professionalCategory.includes(option.value);
                                const optionId = `categoria-option-${option.value.replace(
                                  /\s+/g,
                                  "-"
                                )}`;
                                return (
                                  <label
                                    key={option.value}
                                    htmlFor={optionId}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
                                  >
                                    <Checkbox
                                      id={optionId}
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleProfessionalCategoryToggle(option.value, checked === true)
                                      }
                                    />
                                    <span>{option.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="px-2 py-1 text-sm text-muted-foreground">
                              Nenhuma categoria disponível.
                            </p>
                          )}
                        </PopoverContent>
                        {functionLoadError && (
                          <p className="text-sm text-destructive">{functionLoadError}</p>
                        )}
                      </div>
                    </Popover>
                    <InputField
                      label="Prazo para conclusão"
                      type="date"
                      value={completionDeadline}
                      onChange={(event) => setCompletionDeadline(event.target.value)}
                      className="py-2.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nível de obrigatoriedade
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "obrigatoria", label: "Obrigatória" },
                      { value: "opcional", label: "Opcional" },
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
                      <InputField
                        placeholder="Opção D"
                        value={q.optionD}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "optionD", event.target.value)
                        }
                      />
                      <InputField
                        placeholder="Opção E"
                        value={q.optionE}
                        onChange={(event) =>
                          handleQuestionChange(q.id, "optionE", event.target.value)
                        }
                      />

                      <SelectField
                        label="Resposta correta"
                        options={[
                          { value: "a", label: "Opção A" },
                          { value: "b", label: "Opção B" },
                          { value: "c", label: "Opção C" },
                          { value: "c", label: "Opção D" },
                          { value: "c", label: "Opção E" },
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
