// Game categories
export const GAME_CATEGORIES = [
  'Mobile Legends',
  'Critical Ops',
  'Standoff 2',
  'Wild Rift',
  'E-Football',
  'PUBG Mobile',
  'Roblox',
  'Valorant'
] as const;

// Listing status
export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  PENDING: 'pending'
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LISTINGS: '/listings',
  LISTING_DETAIL: '/listings/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  FAQ: '/faq',
  CONTACT: '/contact',
  TERMS: '/terms',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_USERS: '/admin/users'
} as const;