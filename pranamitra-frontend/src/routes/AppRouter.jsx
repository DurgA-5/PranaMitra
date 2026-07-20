import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";

import Home from "../pages/landing/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import ManageDonors from "../pages/admin/ManageDonors";
import ManagePatients from "../pages/admin/ManagePatients";
import ManageBloodBanks from "../pages/admin/ManageBloodBanks";
import ManageRequests from "../pages/admin/ManageRequests";
import Reports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";
import AdminNotifications from "../pages/admin/Notifications";
import ContactQueries from "../pages/admin/ContactQueries";
import DashboardLayout from "../layouts/DashboardLayout";

// Error Pages - Lazy Loaded
const NotFound = lazy(() => import("../pages/error/NotFound"));
const Forbidden = lazy(() => import("../pages/error/Forbidden"));
const ServerError = lazy(() => import("../pages/error/ServerError"));

// Donor Portal Pages - Lazy Loaded
const DonorDashboard = lazy(() => import("../pages/donor/Dashboard"));
const DonorProfile = lazy(() => import("../pages/donor/Profile"));
const DonorAvailability = lazy(() => import("../pages/donor/Availability"));
const DonorMatchingRequests = lazy(() => import("../pages/donor/MatchingRequests"));
const DonorAcceptedRequests = lazy(() => import("../pages/donor/AcceptedRequests"));
const DonorHistory = lazy(() => import("../pages/donor/History"));
const DonorLivesImpacted = lazy(() => import("../pages/donor/LivesImpacted"));
const DonorNotifications = lazy(() => import("../pages/donor/Notifications"));
const DonorCompleteProfile = lazy(() => import("../pages/donor/CompleteProfile"));

// Patient Portal Pages - Lazy Loaded
const PatientCompleteProfile = lazy(() => import("../pages/patient/CompleteProfile"));
const PatientDashboard = lazy(() => import("../pages/patient/Dashboard"));
const PatientProfile = lazy(() => import("../pages/patient/Profile"));
const PatientMyRequests = lazy(() => import("../pages/patient/MyRequests"));
const PatientRequestBlood = lazy(() => import("../pages/patient/RequestBlood"));
const PatientTrackRequest = lazy(() => import("../pages/patient/TrackRequest"));
const PatientNearbyBloodBanks = lazy(() => import("../pages/patient/NearbyBloodBanks"));
const PatientNotifications = lazy(() => import("../pages/patient/Notifications"));
const PatientSettings = lazy(() => import("../pages/patient/Settings"));

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* ── Admin Routes ─────────────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="donors" element={<ManageDonors />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="bloodbanks" element={<ManageBloodBanks />} />
            <Route path="requests" element={<ManageRequests />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="contact-queries" element={<ContactQueries />} />
          </Route>

          {/* ── Donor Routes ─────────────────────────────────────────────── */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["DONOR"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DonorDashboard />} />
            <Route path="profile" element={<DonorProfile />} />
            <Route path="availability" element={<DonorAvailability />} />
            <Route path="matching" element={<DonorMatchingRequests />} />
            <Route path="accepted" element={<DonorAcceptedRequests />} />
            <Route path="history" element={<DonorHistory />} />
            <Route path="lives-impacted" element={<DonorLivesImpacted />} />
            <Route path="request-blood" element={<PatientRequestBlood />} />
            <Route path="emergency-request" element={<PatientRequestBlood />} />
            <Route path="my-requests" element={<PatientMyRequests />} />
            <Route path="blood-banks" element={<PatientNearbyBloodBanks />} />
            <Route path="notifications" element={<DonorNotifications />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

          {/* Donor Complete Profile (outside layout) */}
          <Route
            path="/donor/complete-profile"
            element={
              <ProtectedRoute allowedRoles={["DONOR"]}>
                <DonorCompleteProfile />
              </ProtectedRoute>
            }
          />

          {/* Patient Complete Profile (outside layout) */}
          <Route
            path="/patient/complete-profile"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientCompleteProfile />
              </ProtectedRoute>
            }
          />

          {/* ── Patient Portal Routes ─────────────────────────────────────── */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboard />} />
            <Route path="requests" element={<PatientMyRequests />} />
            <Route path="request-blood" element={<PatientRequestBlood />} />
            <Route path="track" element={<PatientTrackRequest />} />
            <Route path="blood-banks" element={<PatientNearbyBloodBanks />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="notifications" element={<PatientNotifications />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

          {/* Error Routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;