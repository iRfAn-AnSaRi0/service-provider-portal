import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ProviderDashboard = () => {

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loadingApplication, setLoadingApplication] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await api.get("/application");

                console.log("Application:", response.data);

                setApplication(response.data.data);
            } catch (error) {
                console.log("No application found");
            } finally {
                setLoadingApplication(false);
            }
        };

        fetchApplication();
    }, []);


    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Welcome to ServicePortal 👋
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Complete your provider application to get started.
                </p>
            </div>

            {/* Application Card */}

            {loadingApplication ? (
                <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Loading application...
                    </p>
                </div>
            ) : application ? (
                <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">

                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Provider Application
                        </h2>

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                            {application.status}
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Your application has been saved as a draft.
                        Please review your details and submit your application
                        for admin review.
                    </p>

                    <div className="mt-6">
                        <Button
                            onClick={() => navigate("/provider/application")}
                        >
                            Continue Application
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                </div>
            ) : (
                <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">

                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <h2 className="text-xl font-semibold">
                        Complete Your Application
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Your account has been created successfully. Please complete
                        your provider application by adding your personal details,
                        services, experience, and required documents.
                    </p>

                    <div className="mt-6">
                        <Button
                            onClick={() => navigate("/provider/application")}
                        >
                            Start Application
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                </div>
            )}

        </div>
    );
};

export default ProviderDashboard;