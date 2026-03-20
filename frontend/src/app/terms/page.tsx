export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: 2025</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">About the service</h2>
            <p className="text-gray-700">
                Veneda sells digital recipes. A purchase gives you lifetime access to
                the recipe via your account at veneda.se.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Prices and VAT</h2>
            <p className="text-gray-700">
                All prices are in Swedish kronor (SEK) including 25% VAT.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Payment</h2>
            <p className="text-gray-700">
                Payment is processed by Stripe. We do not store any card details.
                A purchase confirmation is sent by email after a completed payment.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Right of withdrawal</h2>
            <p className="text-gray-700">
                Under the Swedish Distance Contracts Act (distansavtalslagen 2005:59) you normally
                have a 14-day right of withdrawal. Because our recipes are digital content delivered
                immediately upon purchase, and you actively consent to immediate delivery at checkout,
                the right of withdrawal ceases in accordance with ch. 2 § 11 of the Act.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Complaints</h2>
            <p className="text-gray-700">
                For issues with a purchase, contact support@veneda.se within 30 days.
                We always resolve problems caused by us.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Governing law</h2>
            <p className="text-gray-700">
                Swedish law applies. Disputes are settled in Swedish courts.
                You may also contact the Swedish National Board for Consumer Disputes (ARN).
            </p>
        </main>
    );
}