/**
 * Raw API response shapes (DTOs) from DummyJSON.
 * These mirror the API payloads exactly and are mapped into clean
 * domain types inside each feature's mapper.
 */

export interface RawAddress {
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
}

export interface RawUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: "male" | "female";
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: { color: string; type: string };
  university?: string;
  bank?: {
    cardExpire?: string;
    cardNumber?: string;
    cardType?: string;
    currency?: string;
    iban?: string;
  };
  company?: {
    department?: string;
    name?: string;
    title?: string;
  };
  address?: RawAddress;
  role?: string;
}

export interface RawCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface RawCart {
  id: number;
  products: RawCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface RawTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

/** Common paginated envelope used by DummyJSON list endpoints. */
export interface ApiListResponse<T> {
  items?: T[];
  total: number;
  skip: number;
  limit: number;
}
