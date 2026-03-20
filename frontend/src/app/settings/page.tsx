"use client";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
}

export default function SettingsPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            apiFetch<UserProfile>("/user/profile").then(setProfile).catch(console.error);
        }
    }, [isAuthenticated]);

    const handleDeleteAccount = async () => {
        if (!confirm(
            "Are you sure? Your personal data will be permanently deleted. " +
            "Purchase history will be anonymized and kept for 7 years as required by Swedish accounting law."
        )) return;

        await apiFetch("/user/account", { method: "DELETE" });
        logout();
        router.push("/");
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Settings</h1>

            <section className="border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Account details</h2>
                {profile ? (
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Email</dt>
                            <dd className="font-medium">{profile.email}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">First name</dt>
                            <dd className="font-medium">{profile.firstName ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Last name</dt>
                            <dd className="font-medium">{profile.lastName ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Phone</dt>
                            <dd className="font-medium">{profile.phone ?? "—"}</dd>
                        </div>
                    </dl>
                ) : (
                    <p className="text-sm text-gray-400">Loading...</p>
                )}
            </section>

            <section className="border border-red-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-700">Delete account</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Your personal data (name, email, phone) will be permanently deleted.
                    Purchase history will be anonymized and kept for 7 years as required by Swedish accounting law.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete my account</button>
            </section>
        </main>
    )

}