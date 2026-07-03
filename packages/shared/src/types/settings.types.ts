export interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'json' | 'image';
  group: string;
}

export type StudioSettings = {
  studioName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  googleMapsLat: string;
  googleMapsLng: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  heroMediaUrl?: string;
  heroSubtitle_en?: string;
  heroSubtitle_es?: string;
  licenseNumber?: string;
  licenseDates?: string;
  sameDayReservation?: string;
  studioPageContent_en?: string;
  studioPageContent_es?: string;
  /** URL de imagen de fondo para la página /studio */
  studioBgImageUrl?: string;
  /** Color de fondo CSS (ej: #1a1a2e, rgba(0,0,0,0.8)) cuando no hay imagen */
  studioBgColor?: string;
  /** Opacidad del overlay oscuro sobre la imagen de fondo (0-1) */
  studioOverlayOpacity?: string;
  /** Layout de la página: 'default' | 'fullwidth' | 'centered' */
  studioLayout?: string;
};
