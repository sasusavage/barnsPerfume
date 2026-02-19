'use client';

export default function FlashSalesPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-flashlight-line text-4xl text-amber-600"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Flash Sales</h1>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">Create and manage time-limited promotional events with countdown timers.</p>

                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm inline-block w-full max-w-md">
                    <p className="font-semibold text-gray-800 mb-4">No active flash sales found.</p>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center">
                        <i className="ri-add-line mr-2"></i>
                        Create Flash Sale
                    </button>
                </div>
            </div>
        </div>
    );
}
