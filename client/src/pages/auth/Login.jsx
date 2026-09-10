import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const user = await login(email, password);

        if (user.role === "admin") {
            navigate("/admin/dashboard");
        } else if (user.role === "provider") {
            navigate("/provider/dashboard");
        }

    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Invalid email or password";

        console.log(error.response?.data);

        setError(message);

    } finally {
        setLoading(false);
    }
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-background p-8 shadow-sm border">

                <h1 className="text-2xl font-bold text-center">
                    Login
                </h1>

                <p className="text-sm text-muted-foreground text-center mt-2">
                    Login to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >
                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <Input
                            className="mt-1"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <Input
                            className="mt-1"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {/* Login */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                {/* Register */}
                <div className="mt-6 border-t pt-5 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?
                    </p>

                    <Button
                        variant="outline"
                        className="mt-3 w-full"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Login;