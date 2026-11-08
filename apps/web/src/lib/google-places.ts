export interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

// Los fallos de Google no se cachean con `fetch`, así que sin este backoff se
// reintenta (y se escribe en el log) en cada revalidación de la home.
const FAILURE_BACKOFF_MS = 6 * 60 * 60 * 1000; // 6 horas
const REQUEST_TIMEOUT_MS = 5000;

let retryAfter = 0;
let lastFailureReason = '';

function markFailure(reason: string): void {
  retryAfter = Date.now() + FAILURE_BACKOFF_MS;
  if (reason !== lastFailureReason) {
    lastFailureReason = reason;
    console.warn(`[google-places] Reseñas no disponibles (${reason}). Reintentando en 6 h.`);
  }
}

export async function getGooglePlaceReviews(): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    if (lastFailureReason !== 'missing-config') {
      lastFailureReason = 'missing-config';
      console.warn(
        '[google-places] Falta GOOGLE_PLACES_API_KEY o NEXT_PUBLIC_GOOGLE_PLACE_ID. Se usan los testimonios por defecto.',
      );
    }
    return null;
  }

  if (Date.now() < retryAfter) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;

    // We use next.js fetch cache configuration for ISR (24 hours = 86400 seconds)
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      markFailure(`HTTP ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    if (data.status !== 'OK') {
      markFailure(data.status || 'unknown');
      return null;
    }

    retryAfter = 0;
    lastFailureReason = '';

    // Filter only 4 and 5 star reviews, and sort by highest rating
    const reviews = (data.result.reviews || [])
      .filter((review: GoogleReview) => review.rating >= 4)
      .sort((a: GoogleReview, b: GoogleReview) => b.rating - a.rating)
      .slice(0, 3); // Return only top 3 to fit the grid

    return {
      ...data.result,
      reviews,
    };
  } catch (error) {
    markFailure(error instanceof Error ? error.message : String(error));
    return null;
  }
}
