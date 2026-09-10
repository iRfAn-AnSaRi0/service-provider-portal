import ProviderSidebar from "../components/provider/ProviderSidebar";

const ProviderLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">

      <ProviderSidebar />

      <main className="flex-1">
        {children}
      </main>

    </div>
  );
};

export default ProviderLayout;