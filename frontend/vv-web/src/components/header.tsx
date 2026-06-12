import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Header() {
    const { currentUser, setCurrentUser, logout, credibilityScore, setCredibilityScore, } = useAppContext();
    const { showToast } = useToast();

    const [reputationScore, setReputationScore] = useState<number | null>(null);
    

    const isSignedIn = !!currentUser;
    const isHirer = currentUser?.role === "hirer";
    const isVendor = currentUser?.role === "vendor";

    useEffect(() => {
        let cancelled = false;

        const fetchHirerScores = async () => {
            if (!currentUser || currentUser.role !== "hirer") {
                setReputationScore(null);
                setCredibilityScore(null);
                return;
            }

            try {
                const [reputationResponse, credibilityResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/users/${currentUser.id}/reputation`),
                    axios.get(`${API_BASE_URL}/users/${currentUser.id}/credibility`),
                ]);

                if (cancelled) return;

                setReputationScore(reputationResponse.data.reputationScore ?? null);
                setCredibilityScore(credibilityResponse.data.credibilityScore ?? 0);
            } catch (error) {
                console.log(error);

                if (!cancelled) {
                    setReputationScore(null);
                    setCredibilityScore(null);
                }
            }
        };

        fetchHirerScores();

        return () => {
            cancelled = true;
        };
    }, [currentUser]);

    const handleSignOut = () => {
        if (logout) {
            logout();
        } else {
            setCurrentUser(null);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
        }

        localStorage.removeItem("isSignedIn");
        showToast("You have been successfully signed out", "success");

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-[#FEF9FF] text-[#736CED] border-b border-[#D4C1EC] shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="cursor-pointer hover:opacity-80 transition flex items-center">
                    <img src="/vv.png" alt="Venue Vendor Logo" className="h-10 w-auto" />
                </Link>

                {/* Navigation Links */}
                <nav className="flex gap-6 items-center">
                    {isHirer && currentUser && (
                        <div className="flex gap-2 items-center ml-4">
                            {reputationScore !== null && (
                                <div className="bg-[#EDE7F6] text-[#736CED] px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                                    <span>⭐</span>
                                    <span>Reputation: {reputationScore}/5</span>
                                </div>
                            )}

                            {credibilityScore !== null && (
                                <div className="bg-[#EDE7F6] text-[#736CED] px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                                    <span>✔</span>
                                    <span>Credibility: {credibilityScore}%</span>
                                </div>
                            )}
                        </div>
                    )}

                    <Link href="/Hirer" className="text-[#736CED] hover:text-[#6259d9] transition font-medium">
                        Suppliers
                    </Link>

                    {/* Hirer-specific links */}
                    {isHirer && (
                        <>
                            <Link
                                href="/ApplicationStatus"
                                className="text-[#736CED] hover:text-[#6259d9] transition font-medium"
                            >
                                My Applications
                            </Link>

                            <Link
                                href="/HirersProfilePage"
                                className="text-[#736CED] hover:text-[#6259d9] transition font-medium"
                            >
                                Profile
                            </Link>
                        </>
                    )}

                    {/* Vendor-specific links */}
                    {isVendor && (
                        <>
                            <Link
                                href="/Vendor"
                                className="text-[#736CED] hover:text-[#6259d9] transition font-medium"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/VendorsProfilePage"
                                className="text-[#736CED] hover:text-[#6259d9] transition font-medium"
                            >
                                Profile
                            </Link>
                        </>
                    )}

                    {!isSignedIn ? (
                        <Link
                            href="/SignIn"
                            className="text-[#736CED] hover:text-[#6259d9] transition font-medium"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-[#736CED] text-[#FEF9FF] rounded-lg hover:bg-[#6259d9] transition font-medium"
                        >
                            Sign Out
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
