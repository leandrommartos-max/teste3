import { Link, useNavigate } from "react-router-dom";
import { Users, AlertTriangle, CheckCircle, Clock, LogOut } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const setores = [
  { value: "", label: "Todos os setores" },
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
  { value: "centro_cirurgico", label: "Centro Cirúrgico" },
];

const capacitacoes = [
  { value: "", label: "Todas as capacitações" },
  { value: "seguranca_paciente", label: "Segurança do Paciente" },
  { value: "nr32", label: "NR-32" },
  { value: "lgpd", label: "LGPD na Saúde" },
];

const categorias = [
  { value: "", label: "Todas as categorias" },
  { value: "assistencial", label: "Assistencial" },
  { value: "administrativo", label: "Administrativo" },
  { value: "gestao", label: "Gestão" },
];

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Painel do Gestor" 
        showBack={false}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Manager identity */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full gradient-manager flex items-center justify-center text-white text-xl font-bold">
              JC
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Olá, João Carlos
              </h1>
              <p className="text-muted-foreground">
                Setor responsável: UTI
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="card-institutional p-4 mb-6">
            <h3 className="font-medium text-foreground mb-3">Filtros</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <SelectField
                options={setores}
                placeholder="Setor"
              />
              <SelectField
                options={capacitacoes}
                placeholder="Capacitação"
              />
              <SelectField
                options={categorias}
                placeholder="Categoria profissional"
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-manager-light">
                  <Users className="w-5 h-5 text-manager" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-xs text-muted-foreground">Colaboradores</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">18</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">Em atraso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="card-institutional p-5 mb-6">
            <h3 className="font-medium text-foreground mb-4">Aderência por capacitação</h3>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Gráfico de aderência</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <ButtonRole variant="manager" fullWidth asChild>
              <Link to="/gestor/aderencia">
                <Users className="w-5 h-5" />
                Ver colaboradores
              </Link>
            </ButtonRole>

            <ButtonRole variant="ghost" fullWidth onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              Sair
            </ButtonRole>
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
