import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, UserX } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";
import { SelectField } from "@/components/ui/select-field";
import { ButtonRole } from "@/components/ui/button-role";

const roleOptions = [
  { value: "", label: "Todos os perfis" },
  { value: "aluno", label: "Aluno" },
  { value: "gestor", label: "Gestor" },
  { value: "admin", label: "Administrador" },
];

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

const users = [
  {
    id: 1,
    name: "Maria da Silva Santos",
    email: "maria.santos@paulinia.sp.gov.br",
    role: "Aluno",
    status: "ativo",
  },
  {
    id: 2,
    name: "João Carlos Pereira",
    email: "joao.pereira@paulinia.sp.gov.br",
    role: "Gestor",
    status: "ativo",
  },
  {
    id: 3,
    name: "Roberta Mendes",
    email: "roberta.mendes@paulinia.sp.gov.br",
    role: "Administrador",
    status: "ativo",
  },
  {
    id: 4,
    name: "Carlos Eduardo Lima",
    email: "carlos.lima@paulinia.sp.gov.br",
    role: "Aluno",
    status: "inativo",
  },
];

export default function AdminUsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const getRoleChip = (role: string) => {
    switch (role) {
      case "Aluno":
        return <span className="px-2 py-1 text-xs rounded-full bg-student-light text-student font-medium">Aluno</span>;
      case "Gestor":
        return <span className="px-2 py-1 text-xs rounded-full bg-manager-light text-manager font-medium">Gestor</span>;
      case "Administrador":
        return <span className="px-2 py-1 text-xs rounded-full bg-admin-light text-admin font-medium">Admin</span>;
      default:
        return null;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "ativo":
        return <span className="chip-success">Ativo</span>;
      case "inativo":
        return <span className="chip-warning">Inativo</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Usuários e acessos" 
        backTo="/admin/dashboard"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto">
          {/* Header with CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Gerenciamento de Usuários
            </h2>
            <ButtonRole variant="admin" asChild>
              <Link to="/admin/usuarios/novo">
                <Plus className="w-5 h-5" />
                Novo gestor/admin
              </Link>
            </ButtonRole>
          </div>

          {/* Filters */}
          <div className="card-institutional p-4 mb-6">
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <SelectField 
                options={roleOptions} 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                placeholder="Perfil" 
              />
              <SelectField 
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="Status" 
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-institutional pl-10"
                />
              </div>
            </div>
          </div>

          {/* Users list */}
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="card-institutional p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      {getRoleChip(user.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-2">
                      {getStatusChip(user.status)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <ButtonRole variant="outline" size="sm" asChild>
                      <Link to={`/admin/usuarios/${user.id}`}>
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </Link>
                    </ButtonRole>
                    <ButtonRole variant="ghost" size="sm">
                      <UserX className="w-4 h-4" />
                      Desativar
                    </ButtonRole>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
