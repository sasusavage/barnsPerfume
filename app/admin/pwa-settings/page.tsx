'use client';

export default function PWASettingsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-indigo-600 px-8 py-10 text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ri-smartphone-line text-4xl text-white"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mobile App & PWA</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto">Configure your Progressive Web App icon, splash screens, and push notification settings.</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 text-sm">1</span>
                                App Manifest
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-lg p-2" defaultValue="My Store" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-lg p-2" defaultValue="Store" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 text-sm">2</span>
                                App Icons
                            </h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                                <i className="ri-upload-cloud-2-line text-3xl text-gray-400 mb-2"></i>
                                <p className="text-sm text-gray-600">Upload 512x512 PNG</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
