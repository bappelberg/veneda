"use client";

import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    imageUrl: string | null;
}

export default function CookbookPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Recipe | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);
    useEffect(() => {
        if (isAuthenticated) {
            apiFetch<Recipe[]>("/cookbook")
            .then(setRecipes)
            .finally(() => setLoading(false));
        }
    }, [isAuthenticated]);
    
    if (isLoading || loading) return <div className="p-8">Loading your cookbook</div>
    
    if (recipes.length === 0) {
        return (
            <main className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-4">My cookbook</h1>
                <p className="text-gray-500">You have no recipes yet. {" "} <a href="/recipes" className="underline text-green-700">Browse recipes →</a></p>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">My cookbook</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recipes.map(recipe => (
                    <div
                        key={recipe.id}
                        onClick={() => setSelected(recipe)}
                        className="border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition-shadow">
                            {recipe.imageUrl && (
                                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover"/>
                            )}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg">{recipe.title}</h2>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                            </div>
                    </div>
                ))}
            </div>
            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                        <button
                            onClick={() => setSelected(null)}
                            className="float-right text-gray-400 hover:text-black text-2xl leading-none">x</button>
                            <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
                            <p className="text-gray-600 mb-6">{selected.description}</p>
                            <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                            <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-sans mb-6">{selected.ingredients}</pre>
                            <h3 className="font-semibold text-lg">Instructions</h3>
                            <pre className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-sans">{selected.instructions}</pre>
                    </div>
                </div>
            )}
        </main>
    )
}