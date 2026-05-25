export interface Monument {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  year: number;
  address: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  videoUrl: string;
  category: 'memorial' | 'statue' | 'monument' | 'architectural';
}

export interface Route {
  id: string;
  name: string;
  description: string;
  monuments: Monument[];
  totalDistance: number;
  estimatedTime: number;
}
