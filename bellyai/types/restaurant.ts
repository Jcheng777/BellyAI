export interface Restaurant {
  id: string;
  name: string;
  image_url: string;
  business_url: string;
  display_address: string;
  display_phone: string;
  rating: number;
}

export interface RecommendationResponse {
  data: Restaurant;
  summary: string;
}

