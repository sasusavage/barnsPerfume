'use client';

export default function SupportHub() {
    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AI Support Hub</h1>
                    <p className="text-gray-600 mt-1">Manage chatbots, support tickets, and live chat.</p>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                    <i className="ri-settings-4-line mr-2"></i>
                    Configure Chatbot
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Recent Tickets</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-900">Order #1234 Inquiry</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Open</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">Customer is asking about shipping status for order #1234 placed yesterday.</p>
                            <div className="mt-3 text-xs text-gray-500">2 hours ago via Email</div>
                        </div>
                        {/* More fake tickets could go here */}
                        <div className="text-center text-gray-500 py-4 text-sm">No more tickets.</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">AI Status</h3>
                    <div className="flex items-center space-x-3 mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 font-medium text-sm">Chatbot is Active</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Queries Today</span>
                            <span className="font-semibold text-gray-900">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg Response Time</span>
                            <span className="font-semibold text-gray-900">--</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Escalated to Human</span>
                            <span className="font-semibold text-gray-900">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
