export type CollectionType = 'men' | 'women' | 'kids';

export type CategoryType = 
  | 'oversized-t-shirts'
  | 'relaxed-t-shirts'
  | 'contemporary-tops'
  | 'hoodies'
  | 'sweatshirts'
  | 'joggers'
  | 'bottoms'
  | 'matching-sets'
  | 'modest-streetwear'
  | 'accessories';

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  collection: CollectionType;
  category: CategoryType;
  categoryLabel: string;
  pricePKR: number;
  compareAtPricePKR?: number;
  description: string;
  fabricDetails: {
    gsm: number;
    composition: string;
    weave: string;
    origin: string;
  };
  features: string[];
  careInstructions: string[];
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  stockQuantity: number;
  isDraftSample?: boolean;
  featured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'pending_verification' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomer;
  subtotalPKR: number;
  shippingFeePKR: number;
  discountPKR: number;
  totalPKR: number;
  paymentMethod: 'cod' | 'card_demo' | 'bank_transfer';
  status: OrderStatus;
  guestToken?: string;
  isDemo?: boolean;
}

export type Currency = 'PKR' | 'USD' | 'GBP' | 'AED';

export type ActivePage = 
  | 'home' 
  | 'men' 
  | 'women' 
  | 'kids' 
  | 'new-arrivals' 
  | 'shop-all' 
  | 'product-detail'
  | 'about' 
  | 'contact' 
  | 'shipping' 
  | 'returns' 
  | 'privacy' 
  | 'terms'
  | 'admin';
