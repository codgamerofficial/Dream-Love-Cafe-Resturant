import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  image = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
}) => {
  const { settings } = useSettings();

  const siteTitle = title ? `${title} | ${settings.name} Contai` : `${settings.name} — ${settings.tagline} | Contai, West Bengal`;
  const metaDescription = description || `Official website of Dream Love Cafe & Restaurant on Contai Bypass Road, Kishore Nagar Garh, Contai, West Bengal 721404. Serving Indian classics, Tandoor, Chinese, Biryani, mocktails & shakes. Dine-in, Takeaway & Delivery. Call ${settings.phone}.`;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://dreamlove.pages.dev');

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = siteTitle;

      // Google Fonts Preconnect
      if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);
      }

      if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
      }

      // Google Fonts Stylesheet (Instrument Serif + Inter + DM Serif Display + Plus Jakarta Sans)
      const fontHref = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
      if (!document.querySelector(`link[href="${fontHref}"]`)) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = fontHref;
        document.head.appendChild(fontLink);
      }

      // Inject Global Cinematic CSS Styles for Video Hero, Liquid Glass & Animations
      if (!document.getElementById('dream-love-cinematic-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'dream-love-cinematic-styles';
        styleTag.textContent = `
          :root {
            --near-black: #0B0909;
            --warm-charcoal: #171312;
            --dark-surface: #211B19;
            --dream-pink: #FF2D5D;
            --love-red: #E91E45;
            --dream-cyan: #24D5C5;
            --warm-gold: #D9A441;
            --cream: #F4EEE7;
            --muted-text: #A9A19D;
            --font-display: 'Instrument Serif', serif;
            --font-body: 'Inter', sans-serif;
          }

          .font-display {
            font-family: var(--font-display) !important;
          }

          .font-body {
            font-family: var(--font-body) !important;
          }

          /* Liquid Glass Styles */
          .liquid-glass {
            background: rgba(255, 255, 255, 0.055) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 10px 40px rgba(0, 0, 0, 0.12) !important;
            transition: transform 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease !important;
          }

          .liquid-glass:hover {
            transform: translateY(-1px) scale(1.02) !important;
            background: rgba(255, 255, 255, 0.085) !important;
            border-color: rgba(255, 255, 255, 0.22) !important;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.14), 0 14px 44px rgba(0, 0, 0, 0.22) !important;
          }

          /* Glass Navigation Container */
          .glass-navigation {
            background: rgba(18, 15, 13, 0.42) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255, 255, 255, 0.10) !important;
            border-radius: 20px !important;
          }

          /* Cinematic Rise Keyframes */
          @keyframes dream-love-rise {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-dream-rise {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) both;
          }

          .animate-dream-rise-delay-1 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.2s both;
          }

          .animate-dream-rise-delay-2 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.35s both;
          }

          .animate-dream-rise-delay-3 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.5s both;
          }

          .animate-dream-rise-delay-4 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.65s both;
          }

          .animate-dream-rise-delay-5 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.8s both;
          }

          .animate-dream-rise-delay-6 {
            animation: dream-love-rise 0.8s cubic-bezier(.22, 1, .36, 1) 0.9s both;
          }

          /* Minimal Scroll Indicator Line Pulse */
          @keyframes pulse-scroll-line {
            0% {
              transform: translateY(0);
              opacity: 0.2;
            }
            50% {
              transform: translateY(10px);
              opacity: 1;
            }
            100% {
              transform: translateY(18px);
              opacity: 0.1;
            }
          }

          .animate-scroll-pulse {
            animation: pulse-scroll-line 2.4s ease-in-out infinite;
          }

          /* Accessibility: Prefers Reduced Motion */
          @media (prefers-reduced-motion: reduce) {
            .animate-dream-rise,
            .animate-dream-rise-delay-1,
            .animate-dream-rise-delay-2,
            .animate-dream-rise-delay-3,
            .animate-dream-rise-delay-4,
            .animate-dream-rise-delay-5,
            .animate-dream-rise-delay-6,
            .animate-scroll-pulse {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `;
        document.head.appendChild(styleTag);
      }

      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', metaDescription);

      // Open Graph Tags
      const ogTags: { [key: string]: string } = {
        'og:title': siteTitle,
        'og:description': metaDescription,
        'og:type': 'restaurant',
        'og:url': currentUrl,
        'og:image': image,
        'og:site_name': settings.name,
        'twitter:card': 'summary_large_image',
        'twitter:title': siteTitle,
        'twitter:description': metaDescription,
        'twitter:image': image,
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute(property.startsWith('twitter:') ? 'name' : 'property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });
    }
  }, [siteTitle, metaDescription, currentUrl, image, settings.name]);

  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return null;
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": "https://dreamlove.pages.dev/#restaurant",
    "name": settings.name,
    "alternateName": "Dream Love Restaurant",
    "description": settings.tagline,
    "image": [image],
    "telephone": settings.phone,
    "url": "https://dreamlove.pages.dev",
    "menu": "https://dreamlove.pages.dev/menu",
    "servesCuisine": settings.cuisines,
    "priceRange": settings.priceRangeForTwo,
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Card",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address,
      "addressLocality": "Contai",
      "addressRegion": "West Bengal",
      "postalCode": "721404",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings.latitude || 21.782046,
      "longitude": settings.longitude || 87.747065
    },
    "hasMap": settings.googleMapsUrl,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "12:00",
        "closes": "24:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": settings.googleRating.toString(),
      "reviewCount": settings.googleReviewsCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
    </React.Fragment>
  );
};
