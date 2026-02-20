'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    image_url?: string;
}

interface ParallaxSectionProps {
    category: Category;
    index: number;
}

function ParallaxSection({ category, index }: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const handleScroll = () => {
            if (!sectionRef.current) return;

            const { top, height } = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is in view
            if (top < windowHeight && top + height > 0) {
                // Calculate progress: 0 (enter bottom) -> 1 (leave top)
                // Center is 0.5
                const progress = (windowHeight - top) / (windowHeight + height);

                // 1. Text Movement (Parallax Horizontal)
                if (textRef.current) {
                    const direction = index % 2 === 0 ? 1 : -1;
                    const moveX = (progress - 0.5) * 600 * direction; // Move 300px left/right
                    textRef.current.style.transform = `translate(-50%, -50%) translateX(${moveX}px)`;
                }

                // 2. Image Scale (Subtle Zoom)
                if (imageRef.current) {
                    const scale = 1 + (progress * 0.15); // Scale from 1.0 to 1.15
                    imageRef.current.style.transform = `scale(${scale})`;
                }
            }
        };

        const onScroll = () => {
            animationFrameId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', onScroll);
        // Initial call
        handleScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [index]);

    // Determine styles based on category name
    const nameLower = category.name.toLowerCase();

    // Default Style (Oud / Dark / Luxurious)
    let theme = {
        bg: 'bg-black',
        textColor: 'text-white',
        accentColor: 'text-champagne-gold',
        overlay: 'bg-black/40',
        button: 'bg-white hover:bg-champagne-gold text-black hover:text-white',
        titleFont: 'font-serif'
    };

    if (nameLower.includes('men') || nameLower.includes('him')) {
        theme = {
            ...theme,
            bg: 'bg-stone-900', // Charcoal
            overlay: 'bg-stone-900/60'
        };
    } else if (nameLower.includes('women') || nameLower.includes('her')) {
        theme = {
            ...theme,
            bg: 'bg-rose-950',
            overlay: 'bg-rose-900/30', // Silk/Petals tone
            button: 'bg-rose-50 hover:bg-rose-100 text-rose-900'
        };
    } else if (nameLower.includes('oud') || nameLower.includes('intense')) {
        theme = {
            ...theme,
            bg: 'bg-neutral-950',
            overlay: 'bg-black/70' // Mysterious
        };
    }

    // Fallback image if none provided
    const bgImage = category.image || category.image_url || `https://source.unsplash.com/random/1920x1080?perfume,${category.name}`;

    return (
        <div
            ref={sectionRef}
            className={`relative h-[70vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center ${theme.bg}`}
        >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                {/* Using standard img tag for direct ref access, or Next Image with ref? Next Image forwards ref? Yes in 13+ but let's wrap it div for scaling if needed, actually Next Image style prop works */}
                <div className="relative w-full h-full overflow-hidden">
                    <Image
                        ref={imageRef as any}
                        src={bgImage}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-75 will-change-transform"
                        priority={index < 2}
                    />
                </div>
                <div className={`absolute inset-0 ${theme.overlay} backdrop-blur-[0px]`}></div>
            </div>

            {/* Parallax Text Layer (Behind Content) */}
            <div
                ref={textRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] text-center pointer-events-none select-none z-10 opacity-10 will-change-transform"
            >
                <span className={`text-[15vw] leading-none font-serif font-black text-white/50 tracking-tighter whitespace-nowrap`}>
                    THE {category.name.toUpperCase()} COLLECTION
                </span>
            </div>

            {/* Foreground Content Card */}
            <div className="relative z-20 max-w-2xl px-6 text-center">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-14 rounded-2xl shadow-2xl animate-fade-in-up">
                    <h2 className={`text-4xl md:text-6xl ${theme.titleFont} text-white mb-6 drop-shadow-md tracking-wide`}>
                        {category.name}
                    </h2>
                    <p className="text-white/80 text-lg mb-8 font-light max-w-md mx-auto leading-relaxed">
                        Experience the essence of {category.name}. Curated for distinct moments and lasting impressions.
                    </p>
                    <Link
                        href={`/shop?category=${category.slug}`}
                        className={`inline-block px-10 py-4 ${theme.button} font-medium text-sm tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
                    >
                        Explore Collection
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CinematicCategory({ categories }: { categories: Category[] }) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="relative w-full bg-black z-10">
            {categories.map((category, index) => (
                <ParallaxSection key={category.id} category={category} index={index} />
            ))}
        </section>
    );
}
