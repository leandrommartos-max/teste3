import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const procedencias = [
  { value: "unidade_a", label: "Unidade A" },
  { value: "unidade_b", label: "Unidade B" },
  { value: "unidade_c", label: "Unidade C" },
];

const funcoes = [
  { value: "enfermeiro", label: "Enfermeiro(a)" },
  { value: "tecnico_enfermagem", label: "Técnico(a) de Enfermagem" },
  { value: "medico", label: "Médico(a)" },
  { value: "fisioterapeuta", label: "Fisioterapeuta" },
  { value: "administrativo", label: "Administrativo" },
];

const setores = [
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
  { value: "centro_cirurgico", label: "Centro Cirúrgico" },
  { value: "enfermaria", label: "Enfermaria" },
  { value: "cme", label: "CME" },
  { value: "farmacia", label: "Farmácia" },
  { value: "administrativo", label: "Administrativo" },
];

const categorias = [
  { value: "assistencial", label: "Assistencial" },
  { value: "administrativo", label: "Administrativo" },
  { value: "gestao", label: "Gestão" },
];

const instituicoes = [
  { value: "hospital_municipal", label: "Hospital Municipal" },
];

const funcoesCursos = [
  { value: "enfermeiro", label: "Enfermeiro(a)" },
  { value: "tecnico_enfermagem", label: "Técnico(a) de Enfermagem" },
  { value: "medico", label: "Médico(a)" },
];

export default function StudentProfileReview() {
  const navigate = useNavigate();
  const [vinculo, setVinculo] = useState("servidor_concursado");
  const [formData, setFormData] = useState({
    nomeCompleto: "Maria da Silva Santos",
    email: "maria.santos@paulinia.sp.gov.br",
    cpf: "123.456.789-00",
    procedencia: "unidade_a",
    funcao: "enfermeiro",
    setor: "uti",
    categoria: "assistencial",
    instituicao: "hospital_municipal",
    funcaoCurso: "enfermeiro",
    matricula: "12345",
    nomeEmpresa: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmAndContinue = () => {
    navigate("/aluno/dashboard");
  };

  const handleSaveChanges = () => {
    // Visual feedback only
    handleConfirmAndContinue();
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const isServidor = vinculo === "servidor_concursado" || vinculo === "servidor_comissionado";
  const isTerceirizado = vinculo === "terceirizado";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Confirme seus dados" 
        showBack={false}
        showLogout={false}
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-lg mx-auto">
          <p className="text-muted-foreground mb-6 text-center">
            Revise e atualize seus dados, se necessário.
          </p>

          <div className="card-institutional p-6 bg-student-light/30">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <InputField
                label="Nome completo"
                value={formData.nomeCompleto}
                onChange={(e) => handleChange("nomeCompleto", e.target.value)}
              />

              <InputField
                label="E-mail"
                type="email"
                value={formData.email}
                readOnly
                className="bg-muted cursor-not-allowed"
              />

              <InputField
                label="CPF"
                value={formData.cpf}
                readOnly
                className="bg-muted cursor-not-allowed"
              />

              <SelectField
                label="Procedência"
                options={procedencias}
                value={formData.procedencia}
                onChange={(e) => handleChange("procedencia", e.target.value)}
              />

              <SelectField
                label="Função"
                options={funcoes}
                value={formData.funcao}
                onChange={(e) => handleChange("funcao", e.target.value)}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Vínculo de trabalho
                </label>
                <div className="space-y-2">
                  {[
                    { value: "servidor_concursado", label: "Servidor concursado" },
                    { value: "servidor_comissionado", label: "Servidor comissionado" },
                    { value: "terceirizado", label: "Profissional terceirizado" },
                  ].map((v) => (
                    <label
                      key={v.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors bg-card"
                    >
                      <input
                        type="radio"
                        name="vinculo"
                        value={v.value}
                        checked={vinculo === v.value}
                        onChange={(e) => setVinculo(e.target.value)}
                        className="w-4 h-4 text-student"
                      />
                      <span className="text-sm text-foreground">{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional fields */}
              {(isServidor || isTerceirizado) && (
                <div className="p-4 bg-card rounded-lg border border-border space-y-4">
                  {isServidor && (
                    <InputField
                      label="Matrícula"
                      value={formData.matricula}
                      onChange={(e) => handleChange("matricula", e.target.value)}
                    />
                  )}
                  {isTerceirizado && (
                    <InputField
                      label="Nome da empresa"
                      value={formData.nomeEmpresa}
                      onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
                    />
                  )}
                </div>
              )}

              <SelectField
                label="Setor onde trabalha"
                options={setores}
                value={formData.setor}
                onChange={(e) => handleChange("setor", e.target.value)}
              />

              <SelectField
                label="Categoria"
                options={categorias}
                value={formData.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
              />

              <SelectField
                label="Instituição"
                options={instituicoes}
                value={formData.instituicao}
                onChange={(e) => handleChange("instituicao", e.target.value)}
              />

              <SelectField
                label="Função/Curso"
                options={funcoesCursos}
                value={formData.funcaoCurso}
                onChange={(e) => handleChange("funcaoCurso", e.target.value)}
              />
            </form>
          </div>

          <div className="mt-6 space-y-3">
            <ButtonRole 
              variant="student" 
              fullWidth 
              onClick={handleConfirmAndContinue}
            >
              Confirmar e continuar
            </ButtonRole>

            <ButtonRole 
              variant="secondary" 
              fullWidth 
              onClick={handleSaveChanges}
            >
              Salvar alterações
            </ButtonRole>

            <ButtonRole 
              variant="ghost" 
              fullWidth 
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              Sair
            </ButtonRole>
          </div>
        </div>
      </main>
    </div>
  );
}
