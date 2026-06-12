import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: "vendor" | "hirer" | "admin";
};

type SignInResponse = {
    message: string;
    user: AuthUser;
};

type FormErrors = {
    email?: string;
    password?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SignIn() {
    const router = useRouter();
    const { showToast } = useToast();
    const { setCurrentUser } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const getErrorMessage = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || "Unable to sign in. Please try again.";
        }

        return "Unable to sign in. Please try again.";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            showToast(firstError || "Please fix the errors", "error");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post<SignInResponse>(
                `${API_BASE_URL}/auth/signin`,
                {
                    email: email.trim(),
                    password,
                }
            );

            const user = response.data.user;

            if (user.role !== "vendor" && user.role !== "hirer") {
                showToast("This account role is not supported by this dashboard.", "error");
                return;
            }

            setCurrentUser({
                id: user.id,
                role: user.role,
                name: user.name,
            });

            localStorage.setItem("isSignedIn", "true");

            showToast(response.data.message || "Signed in successfully", "success");
            setShowSuccess(true);

            if (user.role === "hirer") {
                router.push("/");
            } else {
                router.push("/Vendor");
            }
        } catch (error) {
            const message = getErrorMessage(error);

            if (message.toLowerCase().includes("email")) {
                setErrors({ email: message });
            } else if (message.toLowerCase().includes("password")) {
                setErrors({ password: message });
            }

            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-[#FEF9FF] to-[#F2DFD7] flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg border border-[#D4C1EC] p-8">
                        <h1 className="text-3xl font-bold text-[#736CED] mb-2 text-center">
                            Welcome
                        </h1>
                        <p className="text-center text-gray-600 mb-8">
                            Sign in to your Venue Vendors account
                        </p>

                        {showSuccess && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                Sign in successful!
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#736CED] mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#736CED] ${
                                        errors.email ? "border-red-500" : "border-[#D4C1EC]"
                                    }`}
                                    placeholder="rmit@gmail.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#736CED] mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#736CED] ${
                                        errors.password ? "border-red-500" : "border-[#D4C1EC]"
                                    }`}
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#736CED] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#6259d9] mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link href="/SignUp" className="text-[#736CED] font-semibold hover:text-[#6259d9] transition">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
