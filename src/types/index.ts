export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string | Date;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  imageUrl: string;
  weight: string;
  rating: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress: string;
  deliveryNotes?: string | null;
  paymentMethod: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export interface Testimonial {
  id: string;
  customerName: string;
  roleOrCity: string;
  rating: number;
  comment: string;
  avatarUrl?: string | null;
  isApproved: boolean;
  createdAt: string | Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}
