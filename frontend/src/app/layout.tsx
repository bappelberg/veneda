import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Veneda",
    description: "Healthy food recipes"
};

export default function RootLayout({
    children,
}: Readonly <{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
            >
                <AuthProvider>
                    <Navbar />
                    {children}
                    <footer className="border-t mt-16 px-8 py-6 text-sm text-gray-500 flex gap-6">
                        <a href="/terms" className="hover:text-black">Terms of Service</a>
                        <a href="/privacy" className="hover:text-black">Privacy Policy</a>
                        <a href="/settings" className="hover:text-black">Settings</a>
                    </footer>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}