'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';

export default function HomepageConfig() {
    const router = useRouter();
    const { refreshCMS } = useCMS();
    const [banners, setBanners] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image_url: '',
        media_type: 'image', // 'image' or 'video'
        button_text: '',
        button_url: '',
        position: 'hero',
        is_active: true,
        sort_order: 0
    });

    useEffect(() => {
        fetchBanners();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, slug')
                .eq('status', 'active')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setBanners(data || []);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBanner = async (id: string, currentState: boolean) => {
        try {
            const { error } = await supabase
                .from('banners')
                .update({ is_active: !currentState })
                .eq('id', id);

            if (error) throw error;
            fetchBanners();
            await refreshCMS();
        } catch (error) {
            console.error('Error toggling banner:', error);
            alert('Failed to update banner status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const { error } = await supabase.from('banners').delete().eq('id', id);
            if (error) throw error;
            fetchBanners();
            await refreshCMS();
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Failed to delete banner');
        }
    };

    const openModal = (banner: any = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                subtitle: banner.subtitle || '',
                image_url: banner.image_url || '',
                media_type: banner.media_type || 'image',
                button_text: banner.button_text || '',
                button_url: banner.button_url || '',
                position: banner.position || 'hero',
                is_active: banner.is_active,
                sort_order: banner.sort_order || 0
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                image_url: '',
                media_type: 'image',
                button_text: '',
                button_url: '',
                position: 'hero',
                is_active: true,
                sort_order: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `banners/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Supabase storage upload error:', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            setFormData(prev => ({
                ...prev,
                image_url: data.publicUrl
            }));

        } catch (error: any) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please ensure you have permission and trial is not expired. Details: ' + (error.message || error.error_description || JSON.stringify(error)));
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                const { error } = await supabase
                    .from('banners')
                    .update(formData)
                    .eq('id', editingBanner.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('banners')
                    .insert([formData]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchBanners();
            await refreshCMS();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Failed to save banner');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Homepage Configuration</h1>
                    <p className="text-gray-600 mt-1">Manage banners, sliders, and featured sections.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
                >
                    <i className="ri-add-line mr-2"></i>
                    Add New Banner
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading banners...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Preview</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Content</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Position</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <i className="ri-image-line text-4xl mb-2 text-gray-300"></i>
                                            <p>No banners found. Click "Add New Banner" to create one.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => (
                                    <tr key={banner.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="w-32 h-16 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                                {banner.image_url ? (
                                                    banner.media_type === 'video' ? (
                                                        <video
                                                            src={banner.image_url}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={banner.image_url}
                                                            alt={banner.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <i className="ri-image-line text-2xl"></i>
                                                    </div>
                                                )}
                                                {banner.media_type === 'video' && (
                                                    <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
                                                        <i className="ri-movie-line text-white text-xs"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-gray-900">{banner.title || 'Untitled Banner'}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{banner.subtitle}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                {banner.position}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => toggleBanner(banner.id, banner.is_active)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${banner.is_active ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${banner.is_active ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => openModal(banner)}
                                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <i className="ri-pencil-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <i className="ri-delete-bin-line text-lg"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingBanner ? 'Edit Banner' : 'New Banner'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Summer Sale"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <textarea
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Banner description..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                            <select
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="hero">Hero Slider</option>
                                                <option value="middle">Middle Section</option>
                                                <option value="promo">Promo Bar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                                            <select
                                                value={formData.media_type}
                                                onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {formData.media_type === 'video' ? 'Video File' : 'Image File'}
                                        </label>
                                        <div className="border border-gray-300 rounded-lg p-2 flex items-center space-x-2">
                                            <input
                                                type="file"
                                                accept={formData.media_type === 'video' ? "video/*" : "image/*"}
                                                onChange={handleFileUpload}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                disabled={uploading}
                                            />
                                            {uploading && <i className="ri-loader-4-line animate-spin text-blue-600"></i>}
                                        </div>
                                        <div className="text-center my-2 text-xs text-gray-500">- OR -</div>
                                        <input
                                            type="text"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder={`Paste ${formData.media_type} URL directly...`}
                                        />

                                        {formData.image_url && (
                                            <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                                {formData.media_type === 'video' ? (
                                                    <video
                                                        src={formData.image_url}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                    />
                                                ) : (
                                                    <img
                                                        src={formData.image_url}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image_url: '' })}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove Image"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                            <input
                                                type="text"
                                                value={formData.button_text}
                                                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Shop Now"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Destination</label>
                                            <div className="space-y-2">
                                                <select
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    onChange={(e) => {
                                                        if (e.target.value !== 'custom') {
                                                            setFormData({ ...formData, button_url: e.target.value });
                                                        }
                                                    }}
                                                    value={
                                                        ['/shop', '/shop?sort=newest', '/about', '/contact'].includes(formData.button_url) ||
                                                            categories.some(c => `/shop?category=${c.slug}` === formData.button_url)
                                                            ? formData.button_url
                                                            : formData.button_url ? 'custom' : ''
                                                    }
                                                >
                                                    <option value="" disabled>Select a page...</option>
                                                    <option value="custom">Custom Link (Type below)</option>
                                                    <option value="/shop">Shop All Products</option>
                                                    <option value="/shop?sort=newest">New Arrivals</option>
                                                    <optgroup label="Categories">
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={`/shop?category=${cat.slug}`}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                    <optgroup label="Other Pages">
                                                        <option value="/about">About Us</option>
                                                        <option value="/contact">Contact</option>
                                                    </optgroup>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={formData.button_url}
                                                    onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                                                    placeholder="e.g. /shop or https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={`px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? 'Uploading...' : 'Save Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
