import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

type UserRole = "hirer" | "vendor";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
};

type SignUpResponse = {
    message: string;
    user: AuthUser;
};

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SignUp() {
    const router = useRouter();
    const { showToast } = useToast();
    const { setCurrentUser } = useAppContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("hirer");
    const [errors, setErrors] = useState<FormErrors>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            newErrors.name = "Name can only contain letters";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 6 characters long";
        }
        
        

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (role !== "hirer" && role !== "vendor") {
            newErrors.role = "Please choose either hirer or vendor";
        }

        return newErrors;
    };

    const getErrorMessage = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || "Unable to create account. Please try again.";
        }

        return "Unable to create account. Please try again.";
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

            const response = await axios.post<SignUpResponse>(
                `${API_BASE_URL}/auth/signup`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,
                }
            );

            const user = response.data.user;

            setCurrentUser({
                id: user.id,
                role: user.role,
                name: user.name,
            });

            localStorage.setItem("isSignedIn", "true");

            showToast(response.data.message || "Account created successfully", "success");
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
                            Create Account
                        </h1>
                        <p className="text-center text-gray-600 mb-8">
                            Sign up to start using Venue Vendors
                        </p>

                        {showSuccess && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                Account created successfully!
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#736CED] mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#736CED] ${
                                        errors.name ? "border-red-500" : "border-[#D4C1EC]"
                                    }`}
                                    placeholder="Enter your name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                <label htmlFor="role" className="block text-sm font-medium text-[#736CED] mb-2">
                                    Account Type
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#736CED] bg-white ${
                                        errors.role ? "border-red-500" : "border-[#D4C1EC]"
                                    }`}
                                >
                                    <option value="hirer">Hirer</option>
                                    <option value="vendor">Vendor</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.role}
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
                                    placeholder="Create a password"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Must contain at least 1 uppercase letter, 1 lowercase letter,
                                    1 special character, and be at least 6 characters long.
                                </p>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#736CED] mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#736CED] ${
                                        errors.confirmPassword ? "border-red-500" : "border-[#D4C1EC]"
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#736CED] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#6259d9] mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link href="/SignIn" className="text-[#736CED] font-semibold hover:text-[#6259d9] transition">
                                    Sign In
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
