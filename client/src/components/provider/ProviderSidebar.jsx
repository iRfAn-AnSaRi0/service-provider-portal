
import {
    LayoutDashboard,
    FileText,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProviderSidebar = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-background">

            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold">
                    ServicePortal
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4">

                {/* Dashboard */}
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                </Button>

                {/* Applications */}
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <FileText className="mr-3 h-5 w-5" />
                    My Applications
                </Button>

                {/* Profile */}
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                </Button>

                {/* Settings */}
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </Button>

            </nav>

            {/* Logout */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={async () => {
                        await logout();
                        navigate("/login");
                    }}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </Button>
            </div>

        </aside>
    );
};

export default ProviderSidebar;
