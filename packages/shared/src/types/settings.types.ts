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
  licenseNumber?: string;
  licenseDates?: string;
  sameDayReservation?: string;
};
