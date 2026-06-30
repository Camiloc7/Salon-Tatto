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

export async function getGooglePlaceReviews(): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn('Google Maps API Key or Place ID is missing.');
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
    
    // We use next.js fetch cache configuration for ISR (24 hours = 86400 seconds)
    const res = await fetch(url, { next: { revalidate: 86400 } });
    
    if (!res.ok) {
      console.error('Failed to fetch from Google Places API:', res.statusText);
      return null;
    }

    const data = await res.json();
    
    if (data.status !== 'OK') {
      console.error('Google Places API returned error:', data.status, data.error_message);
      return null;
    }

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
    console.error('Error fetching Google Place reviews:', error);
    return null;
  }
}
