// User types
export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string | null;
  is_admin: boolean;
  created_at: string;
}

// Listing types
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  game: string;
  category: string;
  images: string[];
  status: 'active' | 'sold' | 'pending';
  seller_id: string;
  created_at: string;
  updated_at: string;
  views_count?: number;
  features?: { key: string; value: string }[];
  tags?: string[];
  seller?: {
    id: string;
    username: string;
    created_at: string;
    listings_count: number;
  };
}

// Transaction types
export interface Transaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}