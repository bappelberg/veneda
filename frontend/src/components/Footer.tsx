"use client";
import Link from "next/link";
import { content } from "@/content";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
    const { footer } = content;
    const { isAuthenticated, logout } = useAuth();
    return (
        <footer className="border-t bg-white dark:bg-black px-8 py-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
                <div>
                    <p className="font-bold text-xl mb-2">Veneda</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {footer.tagline}
                    </p>
                </div>
                <div>
                    <p className="font-semibold text-sm uppercase tracking-widest text-zinc-400 mb-3">Navigate</p>
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li><Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/recipes" className="hover:text-black dark:hover:text-white transition-colors">Recipes</Link></li>
                        <li><Link href="/cookbook" className="hover:text-black dark:hover:text-white transition-colors">My cookbook</Link></li>
                        <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-sm uppercase tracking-widest text-zinc-400 mb-3">Account</p>
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {!isAuthenticated ? (
                        <>
                            <li><Link href="/login" className="hover:text-black dark:hover:text-white transition-colors">Login</Link></li>
                            <li><Link href="/register" className="hover:text-black dark:hover:text-white transition-colors">Register</Link></li>
                        </>
                        ) : (
                            <>
                                <li><Link href="/settings" className="hover:text-black dark:hover:text-white transition-colors">Settings</Link></li>
                                <li><button
                                    onClick={() => logout()}
                                    className="hover:text-black dark:hover:text-white transition-colors">Logout</button></li>
                            </>
                        )}
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-sm uppercase tracking-widest text-zinc-400 mb-3">Legal</p>
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li><Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-5xl mx-auto mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-zinc-400">
                <p>© {new Date().getFullYear()} Veneda. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}