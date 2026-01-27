import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { TopbarSticky } from "@/components/global/TopbarSticky";
import { ButtonRole } from "@/components/ui/button-role";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const roles = [
  { value: "aluno", label: "Aluno" },
  { value: "gestor", label: "Gestor" },
  { value: "admin", label: "Administrador" },
];

const setores = [
  { value: "uti", label: "UTI" },
  { value: "pronto_atendimento", label: "Pronto Atendimento" },
  { value: "centro_cirurgico", label: "Centro Cirúrgico" },
];

const funcoes = [
  { value: "coordenador", label: "Coordenador(a)" },
  { value: "supervisor", label: "Supervisor(a)" },
];

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState("gestor");
  const [managedSectors, setManagedSectors] = useState(["uti", "pronto_atendimento"]);

  const handleSave = () => {
    navigate("/admin/usuarios");
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
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
        title="Detalhes do usuário" 
        backTo="/admin/usuarios"
      />

      <main className="flex-1 px-4 py-6">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* Identity card */}
          <div className="card-institutional p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-manager flex items-center justify-center text-white text-xl font-bold">
                JC
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground">
                  João Carlos Pereira
                </h2>
                <p className="text-muted-foreground text-sm">Gestor</p>
              </div>
            </div>

            <InputField 
              label="Nome completo" 
              defaultValue="João Carlos Pereira" 
            />
            <InputField 
              label="E-mail" 
              type="email" 
              defaultValue="joao.pereira@paulinia.sp.gov.br"
              readOnly
              className="bg-muted cursor-not-allowed"
            />
            <SelectField 
              label="Perfil" 
              options={roles}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <SelectField 
              label="Setor/Área de referência" 
              options={setores} 
              defaultValue="uti"
            />
            <SelectField 
              label="Função" 
              options={funcoes} 
              defaultValue="coordenador"
            />
          </div>

          {/* Managed sectors - only for managers */}
          {role === "gestor" && (
            <div className="card-institutional p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Setores gerenciados</h3>
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

          {/* Account status */}
          <div className="card-institutional p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Status da conta</h3>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Conta ativa" : "Conta inativa"}
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

          {/* Delete button */}
          <ButtonRole 
            variant="danger" 
            fullWidth 
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" />
            Excluir acesso
          </ButtonRole>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Confirmar exclusão
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Esta ação remove o acesso do usuário. Registros institucionais permanecem para auditoria.
            </p>
            
            <div className="flex gap-3">
              <ButtonRole 
                variant="outline" 
                fullWidth 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </ButtonRole>
              <ButtonRole 
                variant="danger" 
                fullWidth 
                onClick={handleDelete}
              >
                Confirmar exclusão
              </ButtonRole>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
