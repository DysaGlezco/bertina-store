export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: ProductCategory;
  tags: string[];
  inStock: boolean;
  featured?: boolean;
  details?: string[];
}

export type ProductCategory =
  | "cuadernos"
  | "libretas"
  | "agendas"
  | "papeleria"
  | "sets";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
