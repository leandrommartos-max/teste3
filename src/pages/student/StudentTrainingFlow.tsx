import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Play,
  CheckCircle2,
  Award,
  Download,
  Share2,
  ChevronRight,
  Clock,
  Calendar,
  X,
} from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { SelectField } from "@/components/ui/select-field";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_BUCKET = "training-documents";

const stages = [
  { id: 1, name: "Detalhes", icon: FileText },
  { id: 2, name: "Conteúdo", icon: Play },
  { id: 3, name: "Avaliação", icon: CheckCircle2 },
  { id: 4, name: "Termo", icon: FileText },
  { id: 5, name: "Conclusão", icon: Award },
];

const TRAINING_ANSWERS_TABLE = "training_answers";
const TRAINING_ATTEMPTS_TABLE = "training_attempts";
const TRAINING_RECORDS_TABLE = "training_records";
const SYS_AUDIT_LOG_TABLE = "sys_audit_log";

type TrainingQuestionOption = {
  id: number | string;
  option_key: string;
  option_text: string;
};

type TrainingQuestion = {
  id: number | string;
  question_text: string;
  options: TrainingQuestionOption[];
};

type TrainingOption = {
  value: string;
  label: string;
  nome_instrutor: string | null;
  prazo_conclusao: string | null;
  duracao_minutos: number | null;
  descricao: string | null;
  texto_termo: string | null;
  reference_pdf_path: string | null;
  cover_image_path: string | null;
  link_video: string | null;
};

export default function StudentTrainingFlow() {
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(1);
  const [selectedTraining, setSelectedTraining] = useState("");

  const [trainingOptions, setTrainingOptions] = useState<TrainingOption[]>([]);
  const [trainingsLoading, setTrainingsLoading] = useState(true);
  const [trainingsError, setTrainingsError] = useState<string | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<TrainingQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmittingAnswers, setIsSubmittingAnswers] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<string | null>(null);
  const [attemptStartedAt, setAttemptStartedAt] = useState<string | null>(null);

  const [showCongratulations, setShowCongratulations] = useState(false);

  const [referencePdfUrl, setReferencePdfUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const defaultTermText =
    "Eu, colaborador(a) da Prefeitura Municipal de Paulínia, declaro que:\n\n1. Concluí integralmente o conteúdo da capacitação.\n2. Compreendi os conceitos, procedimentos e diretrizes apresentados.\n3. Me comprometo a aplicar os conhecimentos adquiridos em minhas atividades profissionais.\n4. Estou ciente de que este registro será mantido para fins de auditoria institucional.\n5. Reconheço que o certificado emitido possui validade institucional.\n\nEste termo é assinado eletronicamente através da confirmação abaixo.";

  // Carrega lista de capacitações (1x)
  useEffect(() => {
    const loadTrainings = async () => {
      setTrainingsLoading(true);
      setTrainingsError(null);

      const { data, error } = await supabase
        .from("trainings")
        .select(
          "id, titulo, nome_instrutor, prazo_conclusao, duracao_minutos, descricao, texto_termo, reference_pdf_path, cover_image_path, link_video",
        )
        .order("titulo", { ascending: true });

      if (error) {
        console.error("Erro ao carregar capacitações:", error);
        setTrainingsError("Não foi possível carregar as capacitações.");
        setTrainingOptions([]);
        setTrainingsLoading(false);
        return;
      }

      const options: TrainingOption[] = (data ?? []).map((training) => ({
        value: training.id,
        label: training.titulo ?? "Capacitação sem título",
        nome_instrutor: training.nome_instrutor ?? null,
        prazo_conclusao: training.prazo_conclusao ?? null,
        duracao_minutos: training.duracao_minutos ?? null,
        descricao: training.descricao ?? null,
        texto_termo: training.texto_termo ?? null,
        reference_pdf_path: training.reference_pdf_path ?? null,
        cover_image_path: training.cover_image_path ?? null,
        link_video: training.link_video ?? null,
      }));

      setTrainingOptions(options);
      setTrainingsLoading(false);
    };

    void loadTrainings();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Erro ao carregar usuário:", error);
        return;
      }

      setUserId(user?.id ?? null);

      if (!user) {
        setStudentId(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil do aluno:", profileError);
        setStudentId(null);
        return;
      }

      setStudentId(profile?.user_id ?? user.id);
    };

    void loadUser();
  }, []);

  const trainingPlaceholder = trainingsLoading
    ? "Carregando capacitações..."
    : "Escolha uma capacitação";

  const trainingHint =
    !trainingsLoading && !trainingsError && trainingOptions.length === 0
      ? "Nenhuma capacitação disponível no momento."
      : undefined;

  const selectedTrainingDetails = trainingOptions.find(
    (training) => training.value === selectedTraining,
  );

  const selectedTrainingLabel =
    selectedTrainingDetails?.label ?? "Capacitação selecionada";

  const prazoConclusaoDate = selectedTrainingDetails?.prazo_conclusao
    ? new Date(selectedTrainingDetails.prazo_conclusao)
    : null;

  const formattedPrazoConclusao =
    prazoConclusaoDate && !Number.isNaN(prazoConclusaoDate.getTime())
      ? prazoConclusaoDate.toLocaleDateString("pt-BR")
      : "Prazo não informado";

  const formattedDuracao = selectedTrainingDetails?.duracao_minutos
    ? `${selectedTrainingDetails.duracao_minutos} min`
    : "Duração não informada";

  // Carrega URL do PDF (signedUrl) quando muda a capacitação selecionada
  useEffect(() => {
    const loadReferencePdfUrl = async () => {
      const referencePdfPath = selectedTrainingDetails?.reference_pdf_path ?? null;

      if (!referencePdfPath) {
        setReferencePdfUrl(null);
        return;
      }

      if (/^https?:\/\//.test(referencePdfPath)) {
        setReferencePdfUrl(referencePdfPath);
        return;
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(referencePdfPath, 60 * 60);

      if (error) {
        console.error("Erro ao gerar URL do PDF:", error);
        setReferencePdfUrl(null);
        return;
      }

      setReferencePdfUrl(data?.signedUrl ?? null);
    };

    void loadReferencePdfUrl();
  }, [selectedTrainingDetails?.reference_pdf_path]);

  useEffect(() => {
    const loadQuizQuestions = async () => {
      setQuizAnswers({});
      setQuizError(null);

      if (!selectedTraining) {
        setQuizQuestions([]);
        return;
      }

      setQuizLoading(true);

      const { data, error } = await supabase
        .from("training_questions")
        .select(
          "id, question_text, training_question_options (id, option_key, option_text)",
        )
        .eq("training_id", selectedTraining)
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao carregar perguntas:", error);
        setQuizError("Não foi possível carregar as perguntas.");
        setQuizQuestions([]);
        setQuizLoading(false);
        return;
      }

      const questions = (data ?? []).map((question) => {
        const options = (question.training_question_options ?? [])
          .filter((option) => option.option_text)
          .sort((a, b) => a.option_key.localeCompare(b.option_key));

        return {
          id: question.id,
          question_text: question.question_text,
          options,
        };
      });

      setQuizQuestions(questions);
      setQuizLoading(false);
    };

    void loadQuizQuestions();
  }, [selectedTraining]);

  useEffect(() => {
    setTermsAccepted(false);
    setTermsAcceptedAt(null);
    setAttemptStartedAt(null);
    setSubmissionError(null);
    setShowCongratulations(false);
  }, [selectedTraining]);

  // Carrega URL da capa (signedUrl) quando muda a capacitação selecionada
  useEffect(() => {
    const loadCoverImageUrl = async () => {
      const coverImagePath = selectedTrainingDetails?.cover_image_path ?? null;

      if (!coverImagePath) {
        setCoverImageUrl(null);
        return;
      }

      if (/^https?:\/\//.test(coverImagePath)) {
        setCoverImageUrl(coverImagePath);
        return;
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(coverImagePath, 60 * 60);

      if (error) {
        console.error("Erro ao gerar URL da capa:", error);
        setCoverImageUrl(null);
        return;
      }

      setCoverImageUrl(data?.signedUrl ?? null);
    };

    void loadCoverImageUrl();
  }, [selectedTrainingDetails?.cover_image_path]);

  const handleNext = () => {
    if (currentStage === 1 && selectedTraining && !attemptStartedAt) {
      setAttemptStartedAt(new Date().toISOString());
    }

    if (currentStage < 5) setCurrentStage((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStage > 1) setCurrentStage((s) => s - 1);
  };

  const handleFinish = async () => {
    setSubmissionError(null);

    const shouldSubmitAnswers = quizQuestions.length > 0;

    if (shouldSubmitAnswers) {
      if (!selectedTraining) {
        setSubmissionError("Selecione uma capacitação antes de finalizar.");
        return;
      }

      if (!userId) {
        setSubmissionError("Não foi possível identificar o usuário.");
        return;
      }

      if (!studentId) {
        setSubmissionError(
          "Não foi possível identificar o perfil do aluno. Tente novamente.",
        );
        return;
      }

      const unansweredQuestions = quizQuestions.filter(
        (question) => !quizAnswers[String(question.id)],
      );

      if (unansweredQuestions.length > 0) {
        setSubmissionError("Responda todas as perguntas antes de finalizar.");
        return;
      }

      setIsSubmittingAnswers(true);

      const answersPayload = quizQuestions.map((question) => {
        const selectedKey = quizAnswers[String(question.id)];
        const selectedOption = question.options.find(
          (option) => option.option_key === selectedKey,
        );

        return {
          question_id: question.id,
          selected_option: selectedOption?.id ?? selectedKey ?? null,
        };
      });

      if (answersPayload.some((answer) => !answer.selected_option)) {
        setSubmissionError("Não foi possível identificar a opção selecionada.");
        setIsSubmittingAnswers(false);
        return;
      }

      if (!selectedTraining) {
        setSubmissionError("Selecione uma capacitação antes de finalizar.");
        setIsSubmittingAnswers(false);
        return;
      }

      if (!userId) {
        setSubmissionError("Não foi possível identificar o usuário.");
        setIsSubmittingAnswers(false);
        return;
      }

      if (!studentId) {
        setSubmissionError(
          "Não foi possível identificar o perfil do aluno. Tente novamente.",
        );
        setIsSubmittingAnswers(false);
        return;
      }

      const totalQuestions = quizQuestions.length;
      const answeredQuestions = Object.keys(quizAnswers).length;
      const nowIso = new Date().toISOString();
      const attemptStart = attemptStartedAt ?? nowIso;
      const resolvedTimeZone =
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : null;

      const clientMetadata = {
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
        language: typeof navigator !== "undefined" ? navigator.language : null,
        platform: typeof navigator !== "undefined" ? navigator.platform : null,
        timezone: resolvedTimeZone,
      };

      const trainingMetadata = {
        training_id: selectedTraining,
        training_title: selectedTrainingLabel,
        instructor: selectedTrainingDetails?.nome_instrutor ?? null,
        duration_minutes: selectedTrainingDetails?.duracao_minutos ?? null,
        deadline: selectedTrainingDetails?.prazo_conclusao ?? null,
        started_at: attemptStart,
        finished_at: nowIso,
        terms_accepted_at: termsAcceptedAt,
        total_questions: totalQuestions,
        answered_questions: answeredQuestions,
      };

      const attemptPayload = {
        student_id: studentId,
        training_id: selectedTraining,
        started_at: attemptStart,
        finished_at: nowIso,
        status: "completed",
        total_questions: totalQuestions,
        answered_questions: answeredQuestions,
        terms_accepted_at: termsAcceptedAt,
        metadata: {
          ...trainingMetadata,
          user_id: userId,
          client: clientMetadata,
        },
      };

      const attemptFallbackPayload = {
        student_id: studentId,
        training_id: selectedTraining,
        started_at: attemptStart,
        finished_at: nowIso,
      };

      const attemptResult = await supabase
        .from(TRAINING_ATTEMPTS_TABLE)
        .insert(attemptPayload)
        .select("id")
        .single();

      let attemptError = attemptResult.error;
      let attemptId = attemptResult.data?.id ?? null;

      if (attemptError) {
        const fallbackResult = await supabase
          .from(TRAINING_ATTEMPTS_TABLE)
          .insert(attemptFallbackPayload)
          .select("id")
          .single();

        attemptError = fallbackResult.error;
        attemptId = fallbackResult.data?.id ?? null;
      }

      if (attemptError || !attemptId) {
        console.error("Erro ao registrar tentativa:", attemptError);
        const fallbackMessage =
          attemptError?.message || attemptError?.details || "Erro desconhecido.";
        setSubmissionError(
          `Não foi possível registrar a tentativa. Detalhes: ${fallbackMessage}`,
        );
        setIsSubmittingAnswers(false);
        return;
      }

      const answersWithAttempt = answersPayload.map((answer) => ({
        ...answer,
        attempt_id: attemptId,
      }));

      const answersResult = await supabase
        .from(TRAINING_ANSWERS_TABLE)
        .insert(answersWithAttempt);

      if (answersResult.error) {
        console.error("Erro ao salvar respostas:", answersResult.error);
        const fallbackMessage =
          answersResult.error.message ||
          answersResult.error.details ||
          "Erro desconhecido.";
        setSubmissionError(
          `Não foi possível enviar suas respostas. Detalhes: ${fallbackMessage}`,
        );
        setIsSubmittingAnswers(false);
        return;
      }

      const recordPayload = {
        training_id: selectedTraining,
        user_id: userId,
        student_id: studentId,
        attempt_id: attemptId,
        completed_at: nowIso,
        status: "completed",
        total_questions: totalQuestions,
        answered_questions: answeredQuestions,
        terms_accepted_at: termsAcceptedAt,
        metadata: {
          ...trainingMetadata,
          client: clientMetadata,
        },
      };

      const recordFallbackPayload = {
        training_id: selectedTraining,
        user_id: userId,
        student_id: studentId,
        attempt_id: attemptId,
        completed_at: nowIso,
      };

      const recordResult = await supabase
        .from(TRAINING_RECORDS_TABLE)
        .insert(recordPayload);

      let recordError = recordResult.error;

      if (recordError) {
        ({ error: recordError } = await supabase
          .from(TRAINING_RECORDS_TABLE)
          .insert(recordFallbackPayload));
      }

      if (recordError) {
        console.error("Erro ao registrar conclusão:", recordError);
        const fallbackMessage =
          recordError.message || recordError.details || "Erro desconhecido.";
        setSubmissionError(
          `Não foi possível registrar a conclusão. Detalhes: ${fallbackMessage}`,
        );
        setIsSubmittingAnswers(false);
        return;
      }

      const auditPayload = {
        user_id: userId,
        action: "training_completed",
        entity_type: "training",
        entity_id: selectedTraining,
        description: `Aluno concluiu a capacitação ${selectedTrainingLabel}.`,
        metadata: {
          ...trainingMetadata,
          attempt_id: attemptId,
          client: clientMetadata,
        },
      };

      const auditFallbackPayload = {
        user_id: userId,
        action: "training_completed",
        entity_id: selectedTraining,
      };

      const auditResult = await supabase.from(SYS_AUDIT_LOG_TABLE).insert(auditPayload);
      let auditError = auditResult.error;

      if (auditError) {
        ({ error: auditError } = await supabase
          .from(SYS_AUDIT_LOG_TABLE)
          .insert(auditFallbackPayload));
      }

      if (auditError) {
        console.error("Erro ao registrar auditoria:", auditError);
        const fallbackMessage =
          auditError.message || auditError.details || "Erro desconhecido.";
        setSubmissionError(
          `Não foi possível registrar auditoria. Detalhes: ${fallbackMessage}`,
        );
        setIsSubmittingAnswers(false);
        return;
      }

      setIsSubmittingAnswers(false);
      setShowCongratulations(true);
      return;
    }

    if (!selectedTraining) {
      setSubmissionError("Selecione uma capacitação antes de finalizar.");
      setIsSubmittingAnswers(false);
      return;
    }

    if (!userId) {
      setSubmissionError("Não foi possível identificar o usuário.");
      setIsSubmittingAnswers(false);
      return;
    }

    if (!studentId) {
      setSubmissionError(
        "Não foi possível identificar o perfil do aluno. Tente novamente.",
      );
      setIsSubmittingAnswers(false);
      return;
    }

    const totalQuestions = quizQuestions.length;
    const answeredQuestions = Object.keys(quizAnswers).length;
    const nowIso = new Date().toISOString();
    const attemptStart = attemptStartedAt ?? nowIso;
    const resolvedTimeZone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null;

    const clientMetadata = {
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : null,
      language: typeof navigator !== "undefined" ? navigator.language : null,
      platform: typeof navigator !== "undefined" ? navigator.platform : null,
      timezone: resolvedTimeZone,
    };

    const trainingMetadata = {
      training_id: selectedTraining,
      training_title: selectedTrainingLabel,
      instructor: selectedTrainingDetails?.nome_instrutor ?? null,
      duration_minutes: selectedTrainingDetails?.duracao_minutos ?? null,
      deadline: selectedTrainingDetails?.prazo_conclusao ?? null,
      started_at: attemptStart,
      finished_at: nowIso,
      terms_accepted_at: termsAcceptedAt,
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
    };

    const attemptPayload = {
      student_id: studentId,
      training_id: selectedTraining,
      started_at: attemptStart,
      finished_at: nowIso,
      status: "completed",
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      terms_accepted_at: termsAcceptedAt,
      metadata: {
        ...trainingMetadata,
        user_id: userId,
        client: clientMetadata,
      },
    };

    const attemptFallbackPayload = {
      student_id: studentId,
      training_id: selectedTraining,
      started_at: attemptStart,
      finished_at: nowIso,
    };

    const attemptResult = await supabase
      .from(TRAINING_ATTEMPTS_TABLE)
      .insert(attemptPayload)
      .select("id")
      .single();

    let attemptError = attemptResult.error;
    let attemptId = attemptResult.data?.id ?? null;

    if (attemptError) {
      const fallbackResult = await supabase
        .from(TRAINING_ATTEMPTS_TABLE)
        .insert(attemptFallbackPayload)
        .select("id")
        .single();

      attemptError = fallbackResult.error;
      attemptId = fallbackResult.data?.id ?? null;
    }

    if (attemptError || !attemptId) {
      console.error("Erro ao registrar tentativa:", attemptError);
      const fallbackMessage =
        attemptError?.message || attemptError?.details || "Erro desconhecido.";
      setSubmissionError(
        `Não foi possível registrar a tentativa. Detalhes: ${fallbackMessage}`,
      );
      setIsSubmittingAnswers(false);
      return;
    }

    const recordPayload = {
      training_id: selectedTraining,
      user_id: userId,
      student_id: studentId,
      attempt_id: attemptId,
      completed_at: nowIso,
      status: "completed",
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      terms_accepted_at: termsAcceptedAt,
      metadata: {
        ...trainingMetadata,
        client: clientMetadata,
      },
    };

    const recordFallbackPayload = {
      training_id: selectedTraining,
      user_id: userId,
      student_id: studentId,
      attempt_id: attemptId,
      completed_at: nowIso,
    };

    const recordResult = await supabase
      .from(TRAINING_RECORDS_TABLE)
      .insert(recordPayload);

    let recordError = recordResult.error;

    if (recordError) {
      ({ error: recordError } = await supabase
        .from(TRAINING_RECORDS_TABLE)
        .insert(recordFallbackPayload));
    }

    if (recordError) {
      console.error("Erro ao registrar conclusão:", recordError);
      const fallbackMessage =
        recordError.message || recordError.details || "Erro desconhecido.";
      setSubmissionError(
        `Não foi possível registrar a conclusão. Detalhes: ${fallbackMessage}`,
      );
      setIsSubmittingAnswers(false);
      return;
    }

    const auditPayload = {
      user_id: userId,
      action: "training_completed",
      entity_type: "training",
      entity_id: selectedTraining,
      description: `Aluno concluiu a capacitação ${selectedTrainingLabel}.`,
      metadata: {
        ...trainingMetadata,
        attempt_id: attemptId,
        client: clientMetadata,
      },
    };

    const auditFallbackPayload = {
      user_id: userId,
      action: "training_completed",
      entity_id: selectedTraining,
    };

    const auditResult = await supabase.from(SYS_AUDIT_LOG_TABLE).insert(auditPayload);
    let auditError = auditResult.error;

    if (auditError) {
      ({ error: auditError } = await supabase
        .from(SYS_AUDIT_LOG_TABLE)
        .insert(auditFallbackPayload));
    }

    if (auditError) {
      console.error("Erro ao registrar auditoria:", auditError);
      const fallbackMessage =
        auditError.message || auditError.details || "Erro desconhecido.";
      setSubmissionError(
        `Não foi possível registrar auditoria. Detalhes: ${fallbackMessage}`,
      );
      setIsSubmittingAnswers(false);
      return;
    }

    setIsSubmittingAnswers(false);
    setShowCongratulations(true);
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
    navigate("/aluno/dashboard");
  };

  const renderProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Etapa {currentStage} de 5
        </span>
        <span className="text-sm font-medium text-foreground">
          {stages[currentStage - 1].name}
        </span>
      </div>
      <div className="flex gap-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex-1 h-2 rounded-full transition-colors ${
              stage.id < currentStage
                ? "bg-success"
                : stage.id === currentStage
                  ? "bg-student"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-6">
            <SelectField
              label="Selecione a capacitação"
              options={trainingOptions}
              value={selectedTraining}
              onChange={(e) => setSelectedTraining(e.target.value)}
              placeholder={trainingPlaceholder}
              hint={trainingHint}
              error={trainingsError ?? undefined}
              disabled={trainingsLoading || trainingOptions.length === 0}
            />

            {selectedTraining && (
              <div className="card-institutional p-5 space-y-4">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {selectedTrainingLabel}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>
                      {selectedTrainingDetails?.nome_instrutor
                        ? selectedTrainingDetails.nome_instrutor
                        : "Instrutor não informado"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Prazo: {formattedPrazoConclusao}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Duração: {formattedDuracao}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedTrainingDetails?.descricao
                    ? selectedTrainingDetails.descricao
                    : "Descrição não informada."}
                </p>

                <ButtonRole
                  variant="student"
                  fullWidth
                  onClick={handleNext}
                  disabled={!selectedTraining}
                >
                  Iniciar capacitação
                  <ChevronRight className="w-4 h-4" />
                </ButtonRole>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="card-institutional p-5">
              <h4 className="font-medium text-foreground mb-3">
                Material de estudo
              </h4>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <FileText className="w-10 h-10 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Apostila - {selectedTrainingLabel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {referencePdfUrl ? "PDF disponível" : "PDF não informado"}
                  </p>
                </div>
                <ButtonRole
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (referencePdfUrl) {
                      window.open(referencePdfUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  disabled={!referencePdfUrl}
                >
                  Abrir
                </ButtonRole>
              </div>
            </div>

            <div className="card-institutional p-5">
              <h4 className="font-medium text-foreground mb-3">Vídeo explicativo</h4>

              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {coverImageUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTrainingDetails?.link_video) {
                        window.open(
                          selectedTrainingDetails.link_video,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                    className="relative h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    disabled={!selectedTrainingDetails?.link_video}
                    aria-label="Abrir vídeo"
                  >
                    <img
                      src={coverImageUrl}
                      alt={`Capa do vídeo ${selectedTrainingLabel}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-student flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-student flex items-center justify-center mx-auto mb-3">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-muted-foreground">
                        {selectedTrainingDetails?.link_video
                          ? "Clique para assistir"
                          : "Vídeo não informado"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <ButtonRole variant="outline" fullWidth onClick={handleBack}>
                Voltar
              </ButtonRole>
              <ButtonRole variant="student" fullWidth onClick={handleNext}>
                Continuar
              </ButtonRole>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="card-institutional p-5">
              <h4 className="font-medium text-foreground mb-4">
                Avaliação de conhecimentos
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Responda às questões abaixo para validar seu aprendizado.
              </p>

              {quizLoading && (
                <p className="text-sm text-muted-foreground">
                  Carregando perguntas...
                </p>
              )}

              {quizError && (
                <p className="text-sm text-destructive">{quizError}</p>
              )}

              {!quizLoading && !quizError && quizQuestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma pergunta foi publicada para esta capacitação.
                </p>
              )}

              {!quizLoading && quizQuestions.length > 0 && (
                <div className="space-y-6">
                  {quizQuestions.map((question, qIndex) => {
                    const questionKey = String(question.id);

                    return (
                      <div key={questionKey} className="space-y-3">
                        <p className="font-medium text-foreground">
                          {qIndex + 1}. {question.question_text}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <label
                              key={`${questionKey}-${option.option_key}`}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={`question_${questionKey}`}
                                checked={quizAnswers[questionKey] === option.option_key}
                                onChange={() =>
                                  setQuizAnswers({
                                    ...quizAnswers,
                                    [questionKey]: option.option_key,
                                  })
                                }
                                className="mt-0.5 w-4 h-4 text-student"
                              />
                              <span className="text-sm text-foreground">
                                {option.option_text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <ButtonRole variant="outline" fullWidth onClick={handleBack}>
                Voltar
              </ButtonRole>
              <ButtonRole
                variant="student"
                fullWidth
                onClick={handleNext}
                disabled={
                  quizLoading ||
                  Boolean(quizError) ||
                  (quizQuestions.length > 0 &&
                    Object.keys(quizAnswers).length < quizQuestions.length)
                }
              >
                Enviar respostas
              </ButtonRole>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="card-institutional p-5">
              <h4 className="font-medium text-foreground mb-4">Termo de ciência</h4>

              <div className="h-64 overflow-y-auto p-4 bg-muted rounded-lg text-sm text-muted-foreground mb-4 whitespace-pre-line">
                {selectedTrainingDetails?.texto_termo?.trim() || defaultTermText}
              </div>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTermsAccepted(checked);
                    setTermsAcceptedAt(checked ? new Date().toISOString() : null);
                  }}
                  className="mt-0.5 w-4 h-4 text-student rounded"
                />
                <span className="text-sm text-foreground">
                  Li e concordo com o termo de ciência acima.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <ButtonRole variant="outline" fullWidth onClick={handleBack}>
                Voltar
              </ButtonRole>
              <ButtonRole
                variant="student"
                fullWidth
                onClick={handleNext}
                disabled={!termsAccepted}
              >
                Confirmar
              </ButtonRole>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="card-institutional p-6 text-center">
              <div className="w-20 h-20 rounded-full gradient-student flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Capacitação concluída!
              </h3>

              <p className="text-muted-foreground mb-6">
                Parabéns por completar a capacitação {selectedTrainingLabel}.
              </p>

              <div className="bg-muted rounded-lg p-4 text-left mb-6">
                <h4 className="font-medium text-foreground mb-3">Resumo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacitação:</span>
                    <span className="text-foreground">{selectedTrainingLabel}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome do Instrutor:</span>
                    <span className="text-foreground">
                      {selectedTrainingDetails?.nome_instrutor ?? "Não informado"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de conclusão:</span>
                    <span className="text-foreground">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="chip-success">Aprovado</span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 mb-6 bg-gradient-to-br from-student-light to-white">
                <div className="border-2 border-dashed border-student/30 rounded p-4 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <Award className="w-8 h-8 text-student mb-2" />

                  <p className="text-xs text-muted-foreground">
                    Você receberá seu certificado no e-mail cadastrado,
                  </p>

                  <p className="text-xs text-muted-foreground">
                    verifique sua caixa de spam!
                  </p>
                </div>
              </div>

            </div>

            <ButtonRole
              variant="student"
              fullWidth
              onClick={handleFinish}
              disabled={isSubmittingAnswers}
            >
              {isSubmittingAnswers ? "Enviando respostas..." : "Finalizar"}
            </ButtonRole>
            {submissionError && (
              <p className="text-sm text-destructive text-center">
                {submissionError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky
        title={selectedTraining ? "Capacitação" : "Selecionar Capacitação"}
        backTo="/aluno/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-2xl mx-auto">
          {renderProgress()}
          {renderStageContent()}
        </div>
      </main>

      {showCongratulations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-card rounded-xl p-8 max-w-md w-full text-center animate-fade-in">
            <button
              onClick={handleCloseCongratulations}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 rounded-full gradient-student flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>

            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Parabéns!
            </h2>

            <p className="text-muted-foreground mb-6">
              Capacitação concluída e registrada para fins institucionais.
            </p>

            <ButtonRole
              variant="student"
              fullWidth
              onClick={handleCloseCongratulations}
            >
              Fechar
            </ButtonRole>
          </div>
        </div>
      )}
    </div>
  );
}
