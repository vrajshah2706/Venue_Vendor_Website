"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/appContext/AppContext";

//type for login response 
type LoginResponse = {
  login: {
    success: boolean;
    message: string;
  };
};

//talking to database
const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(email: $username, password: $password) {
      success
      message
    }
  }
`;

export default function Login() {
    //defining states 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { signIn } = useAppContext();
    const router = useRouter();
    const [login, { loading, error }] = useMutation<LoginResponse>(LOGIN);
    
    //validating username 
    const validateUsername = (value: string): boolean => {
        // must not be empty
        if (!value.trim()) return false;

        // must be text (no pure numbers)
        const isText = /^[a-zA-Z0-9_]+$/.test(value);

        return isText;
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        //preventing refresh 
        e.preventDefault();
        setErrorMsg("");

        if (!validateUsername(username)) {
            setErrorMsg(
                "Username must contain only letters, numbers, or underscores"
            );
            return;
        }

        //calling graphql to check  
        const res = await login({
            variables: { username, password },
        });

        //checking status 
        if (res.data?.login.success) {
        signIn(); //updates header 
        router.push("/dashboard");
        } else {
        setErrorMsg("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FEF9FF] px-4">

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-[#D4C1EC] shadow-xl rounded-2xl p-8">

            <h2 className="text-2xl font-bold text-[#736CED] text-center mb-6">
            Admin Login
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">

            {/* Username */}
            <div>
                <label className="text-sm text-[#736CED] font-medium">
                Username
                </label>
                <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-[#D4C1EC] focus:outline-none focus:ring-2 focus:ring-[#736CED]"
                />
            </div>

            {/* Password */}
            <div>
                <label className="text-sm text-[#736CED] font-medium">
                Password
                </label>
                <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-[#D4C1EC] focus:outline-none focus:ring-2 focus:ring-[#736CED]"
                />
            </div>

            {/* Validation Error */}
            {errorMsg && (
                <p className="text-sm text-red-500 text-center">
                {errorMsg}
                </p>
            )}

            {/* Apollo Error */}
            {error && (
                <p className="text-sm text-red-500 text-center">
                Server error. Try again.
                </p>
            )}

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-[#736CED] text-white font-medium hover:bg-[#6259d9] transition disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            </form>
        </div>
        </div>
    );
    }