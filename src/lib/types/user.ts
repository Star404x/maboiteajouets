/**
 * User account types
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  birth_date?: string; // ISO date
  gender?: string;
  newsletter: boolean;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  type?: string; // home, work, other
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string; // login, logout, profile_update, purchase, etc
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
}

export interface ProfileUpdateRequest {
  full_name?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  newsletter?: boolean;
  bio?: string;
}

export interface AddressCreateRequest {
  type?: string;
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}
