export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last update: 2026</p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Data Controller</h2>
            <p className="text-gray-700">
                Veneda AB, Organisationsnummer 202600-5489,
                Sveavägen 155, 113 46 Solna, support@veneda.se
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">What data do we collect</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Email address</li>
                <li>Name and phone number</li>
                <li>Purchase history (recipe, date, amount)</li>
                <li>Payment information is handled exclusively by Stripe - we store no card details</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Why do we process your data?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>To manage your account and give you access to purchased recipes (contract)</li>
                <li>To send order confirmation by email (contract)</li>
                <li>To comply with Swedish accounting law - purchase data is kept for 7 years (legal obligation)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">Your rights (GDPR)</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your account (via Settings)</li>
                <li>Right to object to processing</li>
            </ul>
            <p className="text-gray-700 mt-2">
                Contact us at support@veneda.se to exercise your rights.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Third parties</h2>
            <p className="text-gray-700">
                We use Stripe for payments and AWS S3 for image storage.
                No personal data is sold or shared with third parties for marketing purposes.
            </p>
            
        </main>
    )
}