import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import logoNep from "@/assets/logo-nep.jpg";
import { supabase } from "@/lib/supabaseClient";

type Option = { value: string; label: string };

const vinculos = [
  { value: "Servidor Concursado", label: "Servidor Concursado" },
  { value: "Servidor Comissionado", label: "Servidor Comissionado" },
  { value: "Profissional Terceirizado", label: "Profissional Terceirizado" },
];

const procedencias: Option[] = [
  {
    value: "Trabalha para a Secretaria de Saúde de Paulínia",
    label: "Trabalha para a Secretaria de Saúde de Paulínia",
  },
  {
    value: "Trabalha ou Estuda em Outra Instituição",
    label: "Trabalha ou Estuda em Outra Instituição",
  },
];

const categorias: Option[] = [
  { value: "Profissional de Outro Serviço", label: "Profissional de Outro Serviço" },
  { value: "Docente", label: "Docente" },
  { value: "Estudante", label: "Estudante" },
];

type FormData = {
  nomeCompleto: string;
  cpf: string;
  email: string;
  procedencia: string;
  funcao: string;
  setor: string;
  categoria: string;
  instituicao: string;
  funcaoCurso: string;
  matricula: string;
  nomeEmpresa: string;
  novaSenha: string;
  confirmarSenha: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [vinculo, setVinculo] = useState("");

  const [funcoes, setFuncoes] = useState<Option[]>([]);
  const [setores, setSetores] = useState<Option[]>([]);

  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    cpf: "",
    email: "",
    procedencia: "",
    funcao: "",
    setor: "",
    categoria: "",
    instituicao: "",
    funcaoCurso: "",
    matricula: "",
    nomeEmpresa: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Carregar funções do Supabase
  useEffect(() => {
    const loadFuncoes = async () => {
      const { data, error } = await supabase.from("funcao").select("id, funcao");

      if (error) {
        console.error("Erro ao carregar funções:", error);
        return;
      }

      setFuncoes(
        (data ?? []).map((item: any) => ({
          value: String(item.id),
          label: item.funcao as string,
        }))
      );
    };

    loadFuncoes();
  }, []);

  // Carregar setores do Supabase
  useEffect(() => {
    const loadSetores = async () => {
      const { data, error } = await supabase.from("setor").select("id, setor");

      if (error) {
        console.error("Erro ao carregar Setores:", error);
        return;
      }

      setSetores(
        (data ?? []).map((item: any) => ({
          value: String(item.id),
          label: item.setor as string,
        }))
      );
    };

    loadSetores();
  }, []);

  // Se NÃO for "outra instituição", limpa os 3 campos extras
  useEffect(() => {
    if (formData.procedencia !== "Trabalha ou Estuda em Outra Instituição") {
      setFormData((prev) => ({
        ...prev,
        categoria: "",
        instituicao: "",
        funcaoCurso: "",
      }));
    }
  }, [formData.procedencia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.novaSenha) {
      alert("Preencha email e senha");
      return;
    }

    if (formData.novaSenha !== formData.confirmarSenha) {
      alert("As senhas não conferem");
      return;
    }

    // Validação condicional: só exige esses campos se for "outra instituição"
    if (formData.procedencia === "Trabalha ou Estuda em Outra Instituição") {
      if (!formData.categoria || !formData.instituicao || !formData.funcaoCurso) {
        alert("Preencha Categoria, Instituição e Função/Curso.");
        return;
      }
    }

    // 1️⃣ Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.novaSenha,
    });

    if (authError || !authData.user) {
      console.error("Erro ao criar usuário (signUp):", authError);
      alert(authError?.message || "Erro ao criar usuário");
      return;
    }

    // 2️⃣ Criar/atualizar perfil na tabela profiles (upsert)
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        user_id: authData.user.id,
        email: formData.email,
        nome_completo: formData.nomeCompleto,
        cpf: formData.cpf,
        procedencia: formData.procedencia,
        funcao: formData.funcao,
        setor: formData.setor,
        categoria:
          formData.procedencia === "Trabalha ou Estuda em Outra Instituição"
            ? formData.categoria
            : null,
        instituicao:
          formData.procedencia === "Trabalha ou Estuda em Outra Instituição"
            ? formData.instituicao
            : null,
        funcao_curso:
          formData.procedencia === "Trabalha ou Estuda em Outra Instituição"
            ? formData.funcaoCurso
            : null,
        vinculo: vinculo,
        matricula: formData.matricula || null,
        nome_empresa: formData.nomeEmpresa || null,
      },
      { onConflict: "user_id" }
    );

    if (profileError) {
      console.error("Erro ao salvar perfil:", profileError);
      alert(
        `Usuário criado, mas erro ao salvar perfil:\n` +
          (profileError.message || "") +
          (profileError.details ? `\n${profileError.details}` : "")
      );
      return;
    }

    // 3️⃣ Tentar autenticar com a senha no Supabase
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.novaSenha,
    });

    if (signInError) {
      alert("Conta criada! Verifique seu e-mail para confirmar e então faça login.");
      navigate("/login");
      return;
    }

    alert("Conta criada e autenticada com sucesso!");
    navigate("/login");
  };

  const isServidor =
    vinculo === "Servidor Concursado" || vinculo === "Servidor Comissionado";
  const isTerceirizado = vinculo === "Profissional Terceirizado";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="py-6 px-4 flex justify-center">
        <img
          src={logoNep}
          alt="NEP - Núcleo de Educação Permanente em Saúde"
          className="w-24 h-auto"
        />
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8">
        <div className="container max-w-md mx-auto">
          <div className="card-institutional p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Criar nova conta
            </h1>
            <p className="text-muted-foreground mb-6">
              Preencha os dados abaixo para se cadastrar
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Nome completo *"
                placeholder="Digite seu nome completo"
                value={formData.nomeCompleto}
                onChange={(e) => handleChange("nomeCompleto", e.target.value)}
                required
              />

              <InputField
                label="CPF *"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                required
              />

              <InputField
                label="E-mail *"
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />

              <SelectField
                label="Procedência *"
                placeholder="Selecione a procedência"
                options={procedencias}
                value={formData.procedencia}
                onChange={(e) => handleChange("procedencia", e.target.value)}
                required
              />

              {/* Campos extras somente se "outra instituição" */}
              {formData.procedencia === "Trabalha ou Estuda em Outra Instituição" && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <SelectField
                    label="Categoria *"
                    placeholder="Selecione a categoria"
                    options={categorias}
                    value={formData.categoria}
                    onChange={(e) => handleChange("categoria", e.target.value)}
                  />

                  <InputField
                    label="Instituição *"
                    placeholder="Digite o nome da instituição"
                    value={formData.instituicao}
                    onChange={(e) => handleChange("instituicao", e.target.value)}
                    required
                  />

                  <InputField
                    label="Função/Curso *"
                    placeholder="Digite sua função ou curso"
                    value={formData.funcaoCurso}
                    onChange={(e) => handleChange("funcaoCurso", e.target.value)}
                    required
                  />

                </div>
              )}

              <SelectField
                label="Função *"
                placeholder="Selecione a função"
                options={funcoes}
                value={formData.funcao}
                onChange={(e) => handleChange("funcao", e.target.value)}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Vínculo de trabalho *
                </label>
                <div className="space-y-2">
                  {vinculos.map((v) => (
                    <label
                      key={v.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="vinculo"
                        value={v.value}
                        checked={vinculo === v.value}
                        onChange={(e) => setVinculo(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional fields */}
              {(isServidor || isTerceirizado) && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Preencher conforme seu vínculo.
                  </p>

                  {isServidor && (
                    <InputField
                      label="Matrícula"
                      placeholder="Digite sua matrícula"
                      value={formData.matricula}
                      onChange={(e) => handleChange("matricula", e.target.value)}
                    />
                  )}

                  {isTerceirizado && (
                    <InputField
                      label="Nome da empresa"
                      placeholder="Digite o nome da empresa"
                      value={formData.nomeEmpresa}
                      onChange={(e) =>
                        handleChange("nomeEmpresa", e.target.value)
                      }
                    />
                  )}
                </div>
              )}

              <SelectField
                label="Setor onde trabalha *"
                placeholder="Selecione o setor"
                options={setores}
                value={formData.setor}
                onChange={(e) => handleChange("setor", e.target.value)}
                required
              />

              <InputField
                label="Nova senha *"
                type="password"
                placeholder="••••••••"
                value={formData.novaSenha}
                onChange={(e) => handleChange("novaSenha", e.target.value)}
                required
              />

              <InputField
                label="Confirmar senha *"
                type="password"
                placeholder="••••••••"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                required
              />

              <div className="pt-4 space-y-3">
                <ButtonRole variant="student" fullWidth type="submit">
                  Criar conta
                </ButtonRole>

                <ButtonRole variant="ghost" fullWidth asChild>
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para login
                  </Link>
                </ButtonRole>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border">
        <div className="container max-w-md mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            Ao criar uma conta, você concorda com os{" "}
            <Link to="/termos" className="text-primary hover:underline">
              Termos de Serviço
            </Link>{" "}
            e a{" "}
            <Link to="/termos" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

