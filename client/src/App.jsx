import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

export default App;