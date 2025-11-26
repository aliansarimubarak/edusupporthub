import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages (stubs)
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import AboutPage from "./pages/public/AboutPage";
import FAQPage from "./pages/public/FAQPage";
import ContactPage from "./pages/public/ContactPage";
import ExpertApplicationPage from "./pages/public/ExpertApplicationPage";
import FacultyDetailPage from "./pages/public/FacultyDetailPage";
import FacultyPage from "./pages/public/FacultyPage";
import SupportPage from "./pages/public/SupportPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";


// (You can add Subjects, FAQ etc. later)

// Student pages (stubs)
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import CreateAssignmentPage from "./pages/student/CreateAssignmentPage";
import MyOrdersPage from "./pages/student/MyOrdersPage";
import MessagesPage from "./pages/student/MessagesPage";
import PaymentsPage from "./pages/student/PaymentsPage";
import ProfilePage from "./pages/student/ProfilePage";
import AssignmentOffersPage from "./pages/student/AssignmentOffersPage";
import StudentOrderDetailPage from "./pages/student/StudentOrderDetailPage";


// Expert pages (stubs)
import ExpertDashboardPage from "./pages/expert/ExpertDashboardPage";
import AvailableAssignmentsPage from "./pages/expert/AvailableAssignmentsPage";
import ExpertOrdersPage from "./pages/expert/ExpertOrdersPage";
import ExpertMessagesPage from "./pages/expert/ExpertMessagesPage";
import ExpertProfilePage from "./pages/expert/ExpertProfilePage";
import WalletPage from "./pages/expert/WalletPage";

// Admin pages (stubs)
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
//import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import OrdersManagementPage from "./pages/admin/OrdersManagementPage";
import DisputesPage from "./pages/admin/DisputesPage";
import AdminExpertVerificationPage from "./pages/admin/AdminExpertVerificationPage";

import { useAuth, getDashboardPathForRole } from "./context/AuthContext";
import type { UserRole } from "./api/auth";

const HomeOrRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  if (!user) return <HomePage />;
  return <Navigate to={getDashboardPathForRole(user.role)} replace />;
};

const AuthPageGuard = ({ mode }: { mode: "login" | "register" | "admin-login" }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  if (user) return <Navigate to={getDashboardPathForRole(user.role)} replace />;

  if (mode === "login") return <LoginPage />;
  if (mode === "register") return <RegisterPage />;
  return <LoginPage />; // simple admin login reuse for now
};

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomeOrRedirect /> },

      // ✅ PUBLIC PAGES (no login required)
      { path: "/FacultyPage", element: <FacultyPage /> },
      { path: "/FacultyPage/:id", element: <FacultyDetailPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/support", element: <SupportPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/expert-apply", element: <ExpertApplicationPage /> },

      // Auth pages (also public, but will redirect if already logged in)
      { path: "/login", element: <AuthPageGuard mode="login" /> },
      { path: "/register", element: <AuthPageGuard mode="register" /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> }
    ],
  },

  // student
  {
    path: "/student",
    element: (
      <ProtectedRoute roles={["STUDENT" as UserRole]}>
        <DashboardLayout role="student" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentDashboardPage /> },
      { path: "assignments/new", element: <CreateAssignmentPage /> },
      { path: "assignments/:id/offers", element: <AssignmentOffersPage /> },
      { path: "orders", element: <MyOrdersPage /> },
      { path: "orders/:id", element: <StudentOrderDetailPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "orders/:id", element: <StudentOrderDetailPage /> },
    ],
  },

  // expert
  {
    path: "/expert",
    element: (
      <ProtectedRoute roles={["EXPERT" as UserRole]}>
        <DashboardLayout role="expert" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ExpertDashboardPage /> },
      { path: "assignments", element: <AvailableAssignmentsPage /> },
      { path: "orders", element: <ExpertOrdersPage /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "profile", element: <ExpertProfilePage /> },
      { path: "messages", element: <ExpertMessagesPage /> },
    ],
  },

  // admin
  {
    path: "/admin/login",
    element: <AuthPageGuard mode="admin-login" />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["ADMIN" as UserRole]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      //{ path: "users", element: <AdminLoginPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "content", element: <ContentManagementPage /> },
      { path: "orders", element: <OrdersManagementPage /> },
      { path: "disputes", element: <DisputesPage /> },
      { path: "users", element: <UsersManagementPage /> },
      {
        path: "expert-verification",
        element: <AdminExpertVerificationPage />,
      },
      
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
