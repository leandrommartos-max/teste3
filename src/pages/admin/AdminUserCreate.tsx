import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const roles = [
  { value: "gestor", label: "Gestor" },
  { value: "admin", label: "Administrador" },
];

const setores = [
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
  { value: "centro_cirurgico", label: "Centro Cirúrgico" },
  { value: "enfermaria", label: "Enfermaria" },
];

const funcoes = [
  { value: "coordenador", label: "Coordenador(a)" },
  { value: "supervisor", label: "Supervisor(a)" },
  { value: "gerente", label: "Gerente" },
];

export default function AdminUserCreate() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [managedSectors, setManagedSectors] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [passwordByUser, setPasswordByUser] = useState(false);

  const handleSave = () => {
    navigate("/admin/usuarios");
  };

  const toggleSector = (sector: string) => {
    if (managedSectors.includes(sector)) {
      setManagedSectors(managedSectors.filter((s) => s !== sector));
    } else {
      setManagedSectors([...managedSectors, sector]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Novo gestor/admin" 
        backTo="/admin/usuarios"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* Identity card */}
          <div className="card-institutional p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Identificação</h3>
            
            {/* Photo upload */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">Foto do usuário</p>

            <InputField label="Nome completo *" placeholder="Digite o nome completo" />
            <InputField label="E-mail *" type="email" placeholder="email@paulinia.sp.gov.br" />
            <SelectField 
              label="Perfil *" 
              options={roles} 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Selecione o perfil" 
            />
            <SelectField label="Setor/Área de referência" options={setores} placeholder="Selecione" />
            <SelectField label="Função" options={funcoes} placeholder="Selecione" />
          </div>

          {/* Manager scopes - only for managers */}
          {role === "gestor" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Setores gerenciados</h3>
              <p className="text-sm text-muted-foreground">
                Selecione os setores que este gestor poderá acompanhar.
              </p>
              <div className="space-y-2">
                {setores.map((setor) => (
                  <label
                    key={setor.value}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={managedSectors.includes(setor.value)}
                      onChange={() => toggleSector(setor.value)}
                      className="w-4 h-4 text-admin rounded"
                    />
                    <span className="text-sm text-foreground">{setor.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Password card */}
          <div className="card-institutional p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Senha de acesso</h3>
            
            <InputField label="Senha *" type="password" placeholder="••••••••" />
            <InputField label="Confirmar senha *" type="password" placeholder="••••••••" />
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={passwordByUser}
                onChange={(e) => setPasswordByUser(e.target.checked)}
                className="w-4 h-4 text-admin rounded"
              />
              <span className="text-sm text-foreground">Senha digitada pelo próprio usuário</span>
            </label>
            
            <p className="text-sm text-muted-foreground">
              A senha deve ser conhecida apenas pelo usuário.
            </p>
          </div>

          {/* Status toggle */}
          <div className="card-institutional p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Status do usuário</h3>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Usuário ativo" : "Usuário inativo"}
                </p>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isActive ? "bg-success" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isActive ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <ButtonRole variant="outline" fullWidth onClick={() => navigate("/admin/usuarios")}>
              Cancelar
            </ButtonRole>
            <ButtonRole variant="admin" fullWidth onClick={handleSave}>
              Salvar
            </ButtonRole>
          </div>
        </div>
      </main>
    </div>
  );
}
