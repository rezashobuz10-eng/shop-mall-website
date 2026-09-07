import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanners = banners.filter((b) => b.status === 'active');
  const slideCount = activeBanners.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto sliding every 5 seconds
  useEffect(() => {
    if (!isPaused && slideCount > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div
      className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative min-h-[360px] sm:min-h-[380px] md:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-95`}
              />

              {/* Decorative light effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-400/20 rounded-full blur-2xl" />

              <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 py-6 sm:py-8">
                {/* Content Left */}
                <div className="flex-1 text-white z-10 max-w-xl text-center md:text-left pt-1 sm:pt-0">
                  {banner.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-4 border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{banner.badge}</span>
                      {banner.discount && (
                        <span className="bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-black ml-1">
                          {banner.discount}
                        </span>
                      )}
                    </div>
                  )}

                  <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-2 sm:mb-3">
                    {banner.title}
                  </h1>

                  <p className="text-xs sm:text-base text-white/90 mb-4 sm:mb-6 font-normal max-w-lg leading-relaxed line-clamp-2">
                    {banner.subtitle}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                    <Link
                      to={banner.link}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-orange-50 text-slate-900 font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-103 transition-all flex items-center gap-1.5 sm:gap-2 active:scale-98"
                    >
                      <span>{banner.buttonText || 'Shop Now'}</span>
                      <ArrowRight className="w-4 h-4 text-orange-600" />
                    </Link>

                    <Link
                      to="/products?filter=deals"
                      className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/25 transition-colors active:scale-98"
                    >
                      Explore Deals
                    </Link>
                  </div>
                </div>

                {/* Visual Image Right */}
                <div className="w-32 h-32 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 shrink-0 relative flex items-center justify-center mb-6 sm:mb-0">
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 transform sm:rotate-1 hover:rotate-0 transition-transform duration-500 bg-white/10 backdrop-blur-xs">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows (visible on tablet/desktop) */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
