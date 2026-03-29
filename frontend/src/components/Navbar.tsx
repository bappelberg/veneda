"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="border-b px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl">Veneda</Link>
                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAdmin && (
                            <Link href="/admin/recipes" className="text-gray-600 hover:text-black bg-yellow-50 border rounded-lg px-3">Admin</Link>
                        )}
                        <Link href="/recipes" className="text-gray-600 hover:text-black">Recipes</Link>
                        {isAuthenticated && (
                            <Link href="/cookbook" className="text-gray-600 hover:text-black">My cookbook</Link>
                        )}
                        <Link href="/about" className="text-gray-600 hover:text-black">About</Link>
                    </div>
                </div>

                {/* Desktop auth */}
                {!isLoading && (
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                    className="border px-4 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    Account
                                    <span className="text-xs text-gray-400">{dropdownOpen ? "▲" : "▼"}</span>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                                        <Link
                                            href="/settings"
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 border-t"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-black">Login</Link>
                                <Link href="/register" className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">Register</Link>
                            </>
                        )}
                    </div>
                )}

                {/* Hamburger button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-1"
                    onClick={() => setMobileOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-3 border-t pt-4">
                    {isAdmin && (
                        <Link href="/admin/recipes" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black bg-yellow-50 border rounded-lg px-3 py-1.5 w-fit">Admin</Link>
                    )}
                    <Link href="/recipes" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black">Recipes</Link>
                    {isAuthenticated && (
                        <Link href="/cookbook" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black">My cookbook</Link>
                    )}
                    <Link href="/about" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black">About</Link>
                    {!isLoading && (
                        <div className="border-t pt-3 flex flex-col gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/settings" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black">Settings</Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="text-left text-red-600 hover:text-red-700"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-black">Login</Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 w-fit">Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
