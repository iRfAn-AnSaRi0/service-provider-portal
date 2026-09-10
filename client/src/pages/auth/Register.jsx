import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(name, email, password);

      // Registration successful
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-background p-8 shadow-sm border">

        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-sm text-muted-foreground text-center mt-2">
          Register to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* Name */}
          <div>
            <label className="text-sm font-medium">
              Name
            </label>

            <Input
              className="mt-1"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

            <div className="relative mt-1">

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Register button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>

        </form>

        {/* Login */}
        <div className="mt-6 border-t pt-5 text-center">

          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>

          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

        </div>

      </div>
    </div>
  );
};

export default Register;