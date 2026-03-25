import React, { useEffect, useState, useCallback, useRef } from "react";
import { getActiveBanners, API_BASE_URL } from "../api";

// Dynamic banner carousel for Svasthya Fresh
// Place it immediately below the header in App:
//   import BannerCarousel from "./components/BannerCarousel";
//   ...
//   <header>...</header>
//   <BannerCarousel />

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasBanners = Array.isArray(banners) && banners.length > 0;

  const normalizeBannersResponse = (json) => {
    if (!json) return [];

    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.banners)) return json.banners;
    if (Array.isArray(json.data?.banners)) return json.data.banners;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.data?.items)) return json.data.items;

    return [];
  };

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getActiveBanners();
      const list = normalizeBannersResponse(res?.data ?? res);
      if (Array.isArray(list) && list.length > 0) {
        setBanners(list);
        setCurrentIndex(0);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error("Failed to load banners", err);
      setError("We couldn't load today’s offers. Showing our signature banner instead.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Auto-play logic (slide every 5s)
  useEffect(() => {
    if (!hasBanners) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= banners.length ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [hasBanners, banners.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // --- Touch swipe support (mobile) ---
  const touchStartXRef = useRef(null);
  const touchDeltaXRef = useRef(0);

  const handleTouchStart = (e) => {
    if (!hasBanners) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current == null) return;
    const touch = e.touches[0];
    touchDeltaXRef.current = touch.clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (!hasBanners || touchStartXRef.current == null) {
      touchStartXRef.current = null;
      touchDeltaXRef.current = 0;
      return;
    }

    const deltaX = touchDeltaXRef.current;
    const threshold = 50; // px

    if (Math.abs(deltaX) > threshold && banners.length > 1) {
      if (deltaX < 0) {
        // swipe left -> next slide
        setCurrentIndex((prev) => (prev + 1 >= banners.length ? 0 : prev + 1));
      } else {
        // swipe right -> previous slide
        setCurrentIndex((prev) => (prev - 1 < 0 ? banners.length - 1 : prev - 1));
      }
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  // Fallback banner when there are no banners (or on error)
  const FallbackBanner = () => (
    <div className="relative flex h-[600px] md:h-[760px] w-full overflow-hidden rounded-t-3xl rounded-b-[60px] md:rounded-b-[100px] bg-[#FDF8F1] shadow-md">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 text-center md:items-start md:px-10 md:py-8 md:text-left">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-emerald-700 uppercase">
          Pure • Natural • Honest
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-snug text-[#6D3123] md:text-3xl">
          Nourish your body
          <span className="block">with herbal goodness</span>
        </h2>
        <p className="mt-3 max-w-md text-xs text-slate-700 md:text-sm">
          Small-batch honey, traditional chikki and wholesome ghee — crafted with
          care, transparency and zero shortcuts for your everyday wellness.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center rounded-full bg-[#6D3123] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/40 transition-colors hover:bg-[#532418] md:text-sm"
        >
          Shop Now
        </button>
      </div>
      <div className="relative hidden h-full flex-1 overflow-hidden md:block">
        <img
          src="/1st.png"
          alt="Herbal wellness banner"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-[600px] md:h-[760px] w-full items-center justify-center rounded-t-3xl rounded-b-[60px] md:rounded-b-[100px] bg-[#FDF8F1]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-[#6D3123]" />
        </div>
      );
    }

    // On error we still show fallback image, with a small message above
    if (error) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] text-[#6D3123] md:text-xs">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchBanners}
              className="rounded-full border border-amber-300 px-2 py-0.5 text-[10px] font-semibold hover:bg-amber-100"
            >
              Retry
            </button>
          </div>
          <FallbackBanner />
        </div>
      );
    }

    if (!hasBanners) {
      return <FallbackBanner />;
    }

    return (
      <div className="relative h-[600px] md:h-[760px] w-full overflow-hidden rounded-t-3xl rounded-b-[60px] md:rounded-b-[100px] bg-[#FDF8F1] shadow-md">
        {/* Slides container */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((banner, index) => {
            // Build image URL from API data; prefix relative paths with API_BASE_URL
            let slideImage =
              banner.image_url ||
              banner.imageUrl ||
              banner.banner_image ||
              banner.bannerImage ||
              banner.image ||
              banner.img ||
              (Array.isArray(banner.images) && (
                banner.images[0]?.image_url ||
                banner.images[0]?.imageUrl ||
                banner.images[0]?.url ||
                banner.images[0]?.image
              )) ||
              "/1st.png";

            if (slideImage && !/^https?:\/\//i.test(slideImage) && !slideImage.startsWith("//")) {
              slideImage = `${API_BASE_URL}${slideImage}`;
            }

            const slideTitle =
              banner.title ||
              banner.heading ||
              banner.headline ||
              banner.text ||
              "Svasthya Fresh";

            const slideSubtitle =
              banner.subtitle ||
              banner.subheading ||
              banner.description ||
              banner.caption ||
              "Pure, natural and honest food for everyday wellness.";

            const slideCtaLabel =
              banner.ctaLabel || banner.ctaText || banner.buttonText || "Shop Now";

            const slideCtaLink =
              banner.ctaLink || banner.link || banner.href || null;

            const onSlideCtaClick = () => {
              if (slideCtaLink) window.location.href = slideCtaLink;
            };

            return (
              <div
                key={banner.id || index}
                className="relative h-full w-full min-w-full flex-shrink-0 overflow-hidden rounded-t-3xl rounded-b-[60px] md:rounded-b-[100px]"
              >
                {/* Full-bleed image */}
                <img
                  src={slideImage}
                  alt={slideTitle}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Text overlay */}
                <div className="relative z-10 flex h-full w-full items-center">
                  <div className="flex h-full w-full items-center bg-gradient-to-r from-black/55 via-black/35 to-black/5 px-6 py-6 md:px-10 md:py-8">
                    <div className="max-w-md text-left text-white">
                      <p className="text-[11px] font-semibold tracking-[0.28em] text-emerald-200 uppercase">
                        Natural • Wholesome • Fresh
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">
                        {slideTitle}
                      </h2>
                      <p className="mt-3 text-xs text-slate-100/90 md:text-sm">
                        {slideSubtitle}
                      </p>
                      <button
                        type="button"
                        onClick={onSlideCtaClick}
                        className="mt-4 inline-flex items-center rounded-full bg-[#FACC6B] px-5 py-2 text-xs font-semibold text-[#6D3123] shadow-md shadow-black/30 transition-colors hover:bg-[#FBBF24] md:text-sm"
                      >
                        {slideCtaLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center space-x-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] shadow-sm">
          {banners.map((banner, index) => (
            <button
              key={banner.id || index}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "w-4 bg-[#6D3123]"
                  : "w-1.5 bg-amber-300"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-[#FDF8F1]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-1 pt-3 md:px-6 md:pb-2 md:pt-4">
        {renderContent()}
      </div>
    </section>
  );
};

export default BannerCarousel;
