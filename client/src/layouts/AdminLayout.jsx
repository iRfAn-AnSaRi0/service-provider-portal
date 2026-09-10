import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      
      <AdminSidebar />

      <main className="flex-1">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;