import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminSidebar = () => {
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

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <Users className="mr-3 h-5 w-5" />
          Providers
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <FileText className="mr-3 h-5 w-5" />
          Applications
        </Button>

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

export default AdminSidebar;