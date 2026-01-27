import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Users, FileText, BarChart3, LogOut, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";

const capacitacoes = [
  { value: "", label: "Todas as capacitações" },
  { value: "seguranca_paciente", label: "Segurança do Paciente" },
  { value: "nr32", label: "NR-32" },
  { value: "lgpd", label: "LGPD na Saúde" },
];

const setores = [
  { value: "", label: "Todos os setores" },
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
];

const categorias = [
  { value: "", label: "Todas as categorias" },
  { value: "assistencial", label: "Assistencial" },
  { value: "administrativo", label: "Administrativo" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Painel NEP" 
        showBack={false}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Admin identity */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full gradient-admin flex items-center justify-center text-white text-xl font-bold">
              RM
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Olá, Roberta Mendes
              </h1>
              <p className="text-muted-foreground">
                Administrador NEP
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="card-institutional p-4 mb-6">
            <h3 className="font-medium text-foreground mb-3">Filtros</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <SelectField options={capacitacoes} placeholder="Capacitação" />
              <SelectField options={setores} placeholder="Setor" />
              <SelectField options={categorias} placeholder="Categoria" />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-admin-light">
                  <Users className="w-5 h-5 text-admin" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-xs text-muted-foreground">Usuários</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-student-light">
                  <BookOpen className="w-5 h-5 text-student" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Capacitações</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-manager-light">
                  <CheckCircle className="w-5 h-5 text-manager" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">78%</p>
                  <p className="text-xs text-muted-foreground">Aderência</p>
                </div>
              </div>
            </div>

            <div className="card-institutional p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground">Em atraso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Link 
              to="/admin/capacitacoes"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg gradient-admin">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-admin transition-colors">
                  Capacitações
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar catálogo
                </p>
              </div>
            </Link>

            <Link 
              to="/admin/usuarios"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-muted">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-admin transition-colors">
                  Usuários
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar acessos
                </p>
              </div>
            </Link>

            <Link 
              to="/admin/auditoria"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-muted">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-admin transition-colors">
                  Auditoria
                </h3>
                <p className="text-sm text-muted-foreground">
                  Log de atividades
                </p>
              </div>
            </Link>

            <Link 
              to="/admin/relatorios"
              className="card-elevated p-5 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-muted">
                <BarChart3 className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-admin transition-colors">
                  Relatórios
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gerar relatórios
                </p>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="card-institutional p-4 flex items-center gap-4 w-full text-left hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-muted">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-medium text-muted-foreground">Sair</span>
          </button>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
