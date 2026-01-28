import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Role = "student" | "manager" | "admin";

type ProtectedRouteProps = {
  allowAnyAuthenticated?: boolean;
  allowedRoles?: Role[];
};

export const ProtectedRoute = ({
  allowAnyAuthenticated = false,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const isAuthorized = useMemo(() => {
    if (!isAuthenticated) {
      return false;
    }

    if (allowAnyAuthenticated) {
      return true;
    }

    if (allowedRoles.length === 0) {
      return false;
    }

    return allowedRoles.some((role) => userRoles.includes(role));
  }, [allowAnyAuthenticated, allowedRoles, isAuthenticated, userRoles]);

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setIsAuthenticated(false);
        setUserRoles([]);
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isActive) {
        return;
      }

      if (!user) {
        setIsAuthenticated(false);
        setUserRoles([]);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      if (allowAnyAuthenticated) {
        setUserRoles([]);
        setLoading(false);
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("papel")
        .eq("usuario_id", user.id);

      if (!isActive) {
        return;
      }

      if (rolesError) {
        console.error("Erro ao carregar papéis do usuário:", rolesError);
        setUserRoles([]);
        setLoading(false);
        return;
      }

      setUserRoles((roles ?? []).map((role) => role.papel));
      setLoading(false);
    };

    loadSession();

    return () => {
      isActive = false;
    };
  }, [allowAnyAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="text-muted-foreground">
            Supabase não configurado. Verifique as variáveis de ambiente para continuar.
          </p>
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Variáveis esperadas</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-left">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
            <p className="mt-2 text-left">
              Após configurar no Vercel, publique novamente para aplicar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAuthorized) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
};
