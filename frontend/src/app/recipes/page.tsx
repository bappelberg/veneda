"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface Recipe {
    id: string;
    title: string;
    description: string;
    priceInOre: number;
    imageUrl: string | null;
}

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch<Recipe[]>("/public/recipes", { skipAuth: true })
            .then(data => setRecipes(data))
            .catch(() => setRecipes([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading recipes</div>

    return (
        <main className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Recipes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                        <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                            {recipe.imageUrl && (
                                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg">{recipe.title}</h2>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                                <p className="mt-3 font-bold text-green-700">{(recipe.priceInOre / 100).toFixed(0)} SEK</p>
                            </div>
                        </div>
                    </Link>
                ))}
                {recipes.length === 0 && (
                    <p className="text-gray-500 col-span-3">No recipes exists yet.</p>
                )}
            </div>
        </main>
    )
}