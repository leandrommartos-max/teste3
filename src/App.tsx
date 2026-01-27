import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Entry pages
import Splash from "./pages/Splash";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";

// Student pages
import StudentProfileReview from "./pages/student/StudentProfileReview";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTrainingFlow from "./pages/student/StudentTrainingFlow";
import StudentTrainingHistory from "./pages/student/StudentTrainingHistory";

// Manager pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerComplianceDetail from "./pages/manager/ManagerComplianceDetail";
import ManagerCollaboratorDossier from "./pages/manager/ManagerCollaboratorDossier";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTrainingCatalog from "./pages/admin/AdminTrainingCatalog";
import AdminTrainingCreate from "./pages/admin/AdminTrainingCreate";
import AdminTrainingDetail from "./pages/admin/AdminTrainingDetail";
import AdminUsersManagement from "./pages/admin/AdminUsersManagement";
import AdminUserCreate from "./pages/admin/AdminUserCreate";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminReports from "./pages/admin/AdminReports";

// Utility pages
import AccessDenied from "./pages/utility/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Entry routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="/termos" element={<TermsAndPrivacy />} />

          {/* Student routes */}
          <Route path="/aluno/revisar-dados" element={<StudentProfileReview />} />
          <Route path="/aluno/dashboard" element={<StudentDashboard />} />
          <Route path="/aluno/capacitacao" element={<StudentTrainingFlow />} />
          <Route path="/aluno/historico" element={<StudentTrainingHistory />} />

          {/* Manager routes */}
          <Route path="/gestor/dashboard" element={<ManagerDashboard />} />
          <Route path="/gestor/aderencia" element={<ManagerComplianceDetail />} />
          <Route path="/gestor/dossie/:id" element={<ManagerCollaboratorDossier />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/capacitacoes" element={<AdminTrainingCatalog />} />
          <Route path="/admin/capacitacoes/nova" element={<AdminTrainingCreate />} />
          <Route path="/admin/capacitacoes/:id" element={<AdminTrainingDetail />} />
          <Route path="/admin/usuarios" element={<AdminUsersManagement />} />
          <Route path="/admin/usuarios/novo" element={<AdminUserCreate />} />
          <Route path="/admin/usuarios/:id" element={<AdminUserDetail />} />
          <Route path="/admin/auditoria" element={<AdminAuditLog />} />
          <Route path="/admin/relatorios" element={<AdminReports />} />

          {/* Utility routes */}
          <Route path="/acesso-negado" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
