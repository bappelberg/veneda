"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Recipe {
    id: string;
    title: string;
    description: string;
    priceInOre: number;
    imageUrl: string | null;
}

export default function RecipeDetailPage() {
    const { id } = useParams<{ id: string}>();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [withdrawalConsent, setWithdrawalConsent] = useState(false);
    const router = useRouter();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [purchased, setPurchased] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [buyError, setBuyError] = useState("");

    useEffect(() => {
        apiFetch<Recipe>(`/public/recipes/${id}`, { skipAuth: true })
            .then(setRecipe)
            .catch(() => setRecipe(null))
            .finally(() => setLoading(false))
    }, [id]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            apiFetch<{ purchased: boolean}>(`/cookbook/check/${id}`)
                .then(data => setPurchased(data.purchased))
                .catch(() => {});
        }
    }, [id, isAuthenticated, authLoading]);

    const handleBuy = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        setBuying(true);
        try {
            const data = await apiFetch<{ url: string }>(`/stripe/checkout?recipeId=${id}&withdrawalConsent=${withdrawalConsent}`,
                { method: "POST" }
            );
            window.location.href = data.url;
        } catch {
            setBuyError("Something went wrong. Try again.");
            setBuying(false);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>
    if (!recipe) return <div className="p-8">Recipe could not be found</div>

    const priceIncVat = recipe.priceInOre / 100;
    const vatAmount = Math.round(priceIncVat * 0.20);

    return (
        <main className="max-w-2xl mx-auto p-8">
            {recipe.imageUrl && (
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                />
            )}
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-gray-600 mb-6">{recipe.description}</p>
            <p className="text-2xl font-bold text-green-700">{priceIncVat} SEK</p>
            <p className="text-sm text-gray-500 mb-8">where vat amount (25%) {vatAmount} SEK</p>
            {purchased ? (
                <div>
                    <p className="text-green-600 font-semibold mb-2">You already own this recipe!</p>
                    <a href="/cookbook" className="underline text-green-700">Go to your cookbook</a>
                </div>
            ) : (
                <div>
                    <div className="flex items-start gap-2 mt-4">
                        <input type="checkbox"
                            id="withdrawal"
                            checked={withdrawalConsent}
                            onChange={e => setWithdrawalConsent(e.target.checked)}
                            className="mt-1"
                        />
                        <label htmlFor="withdrawal" className="text-sm text-gray-600">
                            I understand that this recipe is a digital content that will be delivered immediently and that I therefore resign my return rights in accordance with distansavatalslagen.
                        </label>
                    </div>
                    {buyError && <p className="text-red-500 text-sm mt-3">{buyError}</p>}
                    <button
                        onClick={handleBuy}
                        disabled={!withdrawalConsent || buying}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >{buying ? "Redirecting..." : "Buy now"}</button>
                </div>
            )}
        </main>
    )
}