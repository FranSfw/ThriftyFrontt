// Definición del enum LogReason
export enum LogReason {
  ESTETIC = 'estetic',
  NOT_USABLE = 'not_usable',
  SALE = 'sale',
  PURCHASE = 'purchase',
  REFUND = 'refund',
}

// Definición del enum ProductCategory
export enum ProductCategory {
  DRINKS = 'drinks',
  DESSERTS = 'desserts',
  CUPS = 'cups',
  CONES = 'cones',
  INGREDIENTS = 'ingredients',
  BUCKET = 'bucket',
  THRIFTY_PACK = 'thrifty_pack',
}

export interface Branch {
  id: number;
  branchName: string;
  address: string;
  products?: Product[];
}

export interface Product {
  id: number;
  productName: string;
  description?: string;
  category: ProductCategory;
  initialQuantity: number;
  price: number;
  cost: number;
  imageSrc?: string;
  addedAt: Date;
  branchId: number;
  branch?: Branch;
  logs?: Log[];
}

export interface Log {
  id: number;
  productId: number;
  product?: Product;
  quantityOfChange: string;
  movedAt: Date;
  userId: number;
  user?: User;
  reason: LogReason;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  logs?: Log[];
}
