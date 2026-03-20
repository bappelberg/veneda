"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
    priceInOre: number;
}

export default function AdminRecipesPage() {
    const { isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAdmin) router.push("/");
    }, [isAdmin, authLoading, router]);

    const fetchRecipes = () => 
        apiFetch<Recipe[]>("/admin/recipes")
        .then(setRecipes)
        .finally(() => setLoading(false));
    
        useEffect(() => { if (isAdmin) fetchRecipes(); }, [isAdmin])
        
        const handleDelete = async (id: string) => {
            await apiFetch(`/admin/recipes/${id}`, { method: 'DELETE' });
            setRecipes(prev => prev.filter(r => r.id !== id));
            setConfirmDeleteId(null);
        }
        
        if (authLoading || !isAdmin) return null;
        if (loading) return <div className="p-8">Loading...</div>

        return (
            <main className="max-w-4xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin - Recipes</h1>
                    <Link href="/admin/recipes/new"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            + New recipe
                    </Link>
                </div>
                {recipes.length === 0  ? (
                    <p className="text-gray-500">No recipes yet.</p>
                ): (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2 pr-4">Image</th>
                                <th className="py-2 pr-4">Title</th>
                                <th className="py-2 pr-4">Price</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map(recipe => (
                                <tr key={recipe.id} className="border-b hover:bg-gray-50 align-middle">
                                    <td className="py-3 pr-4">{recipe.imageUrl && (<img src={recipe.imageUrl} className="w-16 h-16 object-cover rounded"/>)}</td>
                                    <td className="py-3 pr-4">{recipe.title}</td>
                                    <td className="py-3 pr-4">{(recipe.priceInOre / 100).toFixed(0)} SEK</td>
                                    <td className="py-3">
                                        <div className="flex gap-4 items-center">
                                            <Link href={`/admin/recipes/${recipe.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                            {confirmDeleteId === recipe.id ? (
                                                <span className="flex gap-2 items-center text-sm">
                                                    <span className="text-gray-600">Are you sure?</span>
                                                    <button onClick={() => handleDelete(recipe.id)} className="text-red-600 font-medium hover:underline">Yes</button>
                                                    <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:underline">No</button>
                                                </span>
                                            ) : (
                                                <button onClick={() => setConfirmDeleteId(recipe.id)} className="text-red-600 hover:underline">Delete</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) }
            </main>
        )
}