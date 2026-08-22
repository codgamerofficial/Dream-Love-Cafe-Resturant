import React from 'react';
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
  image = 'https://dreamlove.pages.dev/assets/logo-wordmark.png',
}) => {
  const { settings } = useSettings();

  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return null;
  }

  const siteTitle = title ? `${title} | ${settings.name}` : `${settings.name} — ${settings.tagline}`;
  const metaDescription = description || `Dream Love Cafe & Restaurant in Contai, West Bengal. Multi-Cuisine Family Dining serving authentic Indian, Tandoor, Chinese & Biryani. Open daily 12 PM - 12 AM. Phone: ${settings.phone}`;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://dreamlove.pages.dev');

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "name": settings.name,
    "description": settings.tagline,
    "image": [image],
    "telephone": settings.phone,
    "url": currentUrl,
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
      "latitude": 21.7788,
      "longitude": 87.7516
    },
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
    "servesCuisine": settings.cuisines,
    "priceRange": settings.priceRangeForTwo,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": settings.googleRating.toString(),
      "reviewCount": settings.googleReviewsCount.toString()
    },
    "hasMenu": `${currentUrl}/menu`
  };

  return (
    <React.Fragment>
      {/* Dynamic SEO Meta Elements Injection for React Native Web */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
    </React.Fragment>
  );
};
