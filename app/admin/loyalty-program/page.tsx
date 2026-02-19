'use client';

export default function LoyaltyPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-trophy-line text-4xl text-yellow-600"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">Configure points, rewards, and referral bonuses for your customers.</p>

                <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg mb-2 flex items-center text-gray-900">
                            <i className="ri-coins-line mr-2 text-yellow-500"></i>
                            Points Configuration
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Set how many points customers earn per GH₵ spent.</p>
                        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium">Configure</button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg mb-2 flex items-center text-gray-900">
                            <i className="ri-gift-line mr-2 text-red-500"></i>
                            Rewards Catalog
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Manage products and discounts redeemable with points.</p>
                        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium">Manage Rewards</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
