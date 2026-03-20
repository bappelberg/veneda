"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface RecipeForm {
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    priceInOre: string;
    imageUrl: string;
}

export default function EditRecipePage() {
    const { isAdmin, isLoading: authLoading } = useAuth();
    const { id } = useParams<{ id: string}>();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAdmin) router.push("/");
    }, [isAdmin, authLoading, router]);
    const [form, setForm] = useState<RecipeForm>({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        priceInOre: "",
        imageUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch<any>(`/admin/recipes/${id}`)
        .then((recipe: any) => {
            setForm({
                title: recipe.title,
                description: recipe.description,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                priceInOre: String(recipe.priceInOre),
                imageUrl: recipe.imageUrl || ""
            });
        })
        .finally(() => setLoading(false));
    }, [id]);
    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value}));
    
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await apiFetch(`/admin/recipes/${id}`, {
                method: "PUT",
                body: JSON.stringify({ ...form, priceInOre: parseInt(form.priceInOre)})
            })
            router.push("/admin/recipes");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setSaving(false);
        }
    }

    if (authLoading || !isAdmin) return null;
    if (loading) return <div className="p-8">Loading...</div>
    
    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Edit recipe</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="border rounded-lg p-3"
                    placeholder="Title"
                    value={form.title}
                    onChange={set("title")}
                    required
                />
                <textarea
                    className="border rounded-lg p-3"
                    placeholder="Description"
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                    required
                />
                <textarea
                    className="border rounded-lg p-3"
                    placeholder="Ingredients"
                    rows={6}
                    value={form.ingredients}
                    onChange={set("ingredients")}
                    required
                />
                <textarea
                    className="border rounded-lg"
                    placeholder="Instructions"
                    rows={8}
                    value={form.instructions}
                    onChange={set("instructions")}
                    required
                />
                <input
                    className="border rounded-lg p-3"
                    placeholder="Price in ore"
                    type="number"
                    min="1"
                    value={form.priceInOre}
                    onChange={set("priceInOre")}
                    required
                />
                <input 
                    className="border rounded-lg p-3"
                    placeholder="Image url"
                    value={form.imageUrl}
                    onChange={set("imageUrl")}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >{saving ? "Saving..." : "Save edit"}</button>
            </form>
        </main>
    )
}