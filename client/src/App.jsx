import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AppRoute from "./routes/AppRoutes";

function App() {
  return (
    // <AdminLayout>
    //   <AdminDashboard />
    // </AdminLayout>

    // <Register/>
    // <Login />
    <AppRoute/>
  );
}

export default App;