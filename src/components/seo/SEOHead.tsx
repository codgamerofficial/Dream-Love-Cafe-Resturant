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
