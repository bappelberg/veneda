"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordRequirements = [
        { label: "Atleast 8 characters", test: (p: string) => p.length >= 8 },
        { label: "One uppercase character", test: (p: string) => /[A-Z]/.test(p) },
        { label: "One number", test: (p: string) => /[0-9]/.test(p) },
        { label: "One special character", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const allMet = passwordRequirements.every((r) => r.test(form.password));
        
        if (!allMet) {
            setError("Password does not fulfill requirements");
            return;
        }

        setLoading(true);
        try {
            await register(form);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Register
                </h1>
                { error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password *
                        </label>
                        <input 
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                        <ul className="mt-2 space-y-1">
                            {passwordRequirements.map((req, i) => (
                                <li key={i} className={`text-xs ${req.test(form.password) ? "text-green-600 dark:text-green-400" : "text-zinc-400"}`}>
                                    {req.test(form.password) ? "✓" : "○"} {req.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                    Login
                    </Link>
                </p>
            </div>
        </div>
    )

}