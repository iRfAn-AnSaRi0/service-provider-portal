import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProviderLayout from "@/layouts/ProviderLayout";
import ProviderDashboard from "@/pages/provider/ProviderDashboard";

import ProtectedRoute from "./ProtectedRoute";

import Application from "@/pages/provider/Application";

const AppRoute = () => {
    return (
        <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/provider/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["provider"]}>
                        <ProviderLayout>
                            <ProviderDashboard />
                        </ProviderLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/provider/application"
                element={
                    <ProtectedRoute allowedRoles={["provider"]}>
                        <ProviderLayout>
                            <Application />
                        </ProviderLayout>
                    </ProtectedRoute>
                }
            />

        </Routes>


    );
};

export default AppRoute;