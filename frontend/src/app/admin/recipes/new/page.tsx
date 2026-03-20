"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function NewRecipePage() {
    const { isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAdmin) router.push("/");
    }, [isAdmin, authLoading, router]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        priceInOre: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value}));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            let imageUrl = "";
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const token = localStorage.getItem("accessToken");
                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || `Image upload failed (${res.status})`);
                }
                const data = await res.json();
                imageUrl = data.url;
            }
            await apiFetch("/admin/recipes", {
                method: "POST",
                body: JSON.stringify({ ...form, priceInOre: parseInt(form.priceInOre), imageUrl })
            });
            router.push("/admin/recipes");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setSaving(false);
        }
    };

    if (authLoading || !isAdmin) return null;

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">New recipe</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input className="border rounded-lg p-3"
                    placeholder="Title"
                    value={form.title}
                    onChange={set("title")}
                    required
                />
                <textarea
                    className="border rounded-lg p-3"
                    placeholder="Description (public view)"
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                    required
                />
                <textarea
                    className="border rounded-lg p-3"
                    placeholder="Ingredients (purchased view)"
                    rows={6}
                    value={form.ingredients}
                    onChange={set("ingredients")}
                    required
                />
                <textarea
                    className="border rounded-lg p-3"
                    placeholder="Instructions (purchased view)"
                    rows={8}
                    value={form.instructions}
                    onChange={set("instructions")}
                    required
                />
                <input 
                    className="border rounded-lg p-3"
                    placeholder="Price in ore - e.g. 9900 = 99 SEK"
                    type="number"
                    min="1"
                    value={form.priceInOre}
                    onChange={set("priceInOre")}
                    required
                />
                <input
                    className="border rounded-lg p-3"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={saving} className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                    {saving ? "Saving...": "Create recipe"}
                </button>
            </form>
        </main>
    )
}