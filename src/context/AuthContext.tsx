import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order, Address } from '../types';

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  isAdmin: boolean;
  orders: Order[];
  userOrders: Order[];
  login: (phoneOrEmail: string, password?: string) => LoginResult;
  register: (name: string, email: string, phone: string, password?: string) => LoginResult;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-101',
  name: 'Anisur Rahman',
  email: 'anis@example.com',
  phone: '01712345678',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  createdAt: '2026-01-15',
  addresses: [
    {
      id: 'addr-1',
      name: 'Anisur Rahman',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      fullAddress: 'House 42, Road 11, Block D, Banani',
      isDefault: true,
    },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9082',
    trackingNumber: 'UC-2026-9082',
    userId: 'usr-101',
    userEmail: 'anis@example.com',
    userName: 'Anisur Rahman',
    userPhone: '01712345678',
    items: [
      {
        product: {
          id: 'p-1',
          titleBn: 'রাজকীয় প্রিমিয়াম কটন এম্ব্রয়ডারি পাঞ্জাবি - গোল্ডেন নাইট',
          titleEn: 'Royal Premium Cotton Embroidered Panjabi - Golden Knight',
          slug: 'royal-premium-cotton-panjabi-golden-knight',
          category: 'panjabi',
          price: 3250,
          originalPrice: 3800,
          images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
          sizes: ['L'],
          colors: [{ nameBn: 'ডিজিটাল ব্ল্যাক', nameEn: 'Digital Black', hex: '#111111' }],
          inStock: true,
          stockCount: 45,
          rating: 4.9,
          reviewsCount: 38,
          descriptionBn: 'প্রিমিয়াম এম্ব্রয়ডারি পাঞ্জাবি',
          descriptionEn: 'Embroidered Panjabi',
          fabricBn: 'কটন',
          fabricEn: 'Cotton',
          careInstructionsBn: 'হাতে ধুয়ে নিন',
          careInstructionsEn: 'Hand wash',
          tags: ['Panjabi'],
          createdAt: '2026-07-20',
        },
        selectedSize: 'L',
        selectedColor: { nameBn: 'ডিজিটাল ব্ল্যাক', nameEn: 'Digital Black', hex: '#111111' },
        quantity: 1,
      },
    ],
    subtotal: 3250,
    discountAmount: 325,
    shippingFee: 0,
    totalAmount: 2925,
    shippingAddress: {
      id: 'addr-1',
      name: 'Anisur Rahman',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      fullAddress: 'House 42, Road 11, Block D, Banani',
      isDefault: true,
    },
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    createdAt: '2026-08-02T14:30:00Z',
    estimatedDeliveryDate: '2026-08-06',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('uc_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('uc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('uc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('uc_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('uc_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (phoneOrEmail: string, password?: string): LoginResult => {
    const inputClean = (phoneOrEmail || '').trim().toLowerCase();
    const passClean = (password || '').trim();

    // Admin Credentials match check
    const isOwnerAdmin = inputClean === 'amsamiul27@gmail.com';
    const isGeneralAdmin = inputClean === 'admin@uniquecollection.com' || inputClean.startsWith('admin');

    if (isOwnerAdmin || isGeneralAdmin) {
      // Validate password if provided
      if (isOwnerAdmin && passClean && passClean !== 'amsamiul27') {
        return { success: false, message: 'পাসওয়ার্ডটি সঠিক নয়! (Incorrect admin password)' };
      }

      const adminUser: User = {
        id: isOwnerAdmin ? 'usr-admin-amsamiul' : 'usr-admin-default',
        name: isOwnerAdmin ? 'Am Samiul Islam Abir (Owner)' : 'Unique Collection Admin',
        email: isOwnerAdmin ? 'amsamiul27@gmail.com' : 'admin@uniquecollection.com',
        phone: '01716460606',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        addresses: DEFAULT_USER.addresses,
        createdAt: '2025-01-01',
      };
      setUser(adminUser);
      return {
        success: true,
        user: adminUser,
        message: 'এডমিন ড্যাশবোর্ডে স্বাগতম! (Admin Login Successful)',
      };
    }

    // Customer Login
    const customerUser: User = {
      id: `usr-${Date.now()}`,
      name: inputClean.includes('@') ? inputClean.split('@')[0] : 'Customer User',
      email: inputClean.includes('@') ? inputClean : `${inputClean}@uniquecollection.com`,
      phone: inputClean.includes('@') ? '01712345678' : inputClean,
      role: 'customer',
      addresses: DEFAULT_USER.addresses,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(customerUser);
    return {
      success: true,
      user: customerUser,
      message: 'সফলভাবে লগইন হয়েছে! (Login Successful)',
    };
  };

  const register = (name: string, email: string, phone: string, password?: string): LoginResult => {
    const isOwnerAdmin = email.trim().toLowerCase() === 'amsamiul27@gmail.com';

    const newUser: User = {
      id: isOwnerAdmin ? 'usr-admin-amsamiul' : `usr-${Date.now()}`,
      name: name || (isOwnerAdmin ? 'Am Samiul Islam Abir' : 'New Member'),
      email: email,
      phone: phone || '01716460606',
      role: isOwnerAdmin ? 'admin' : 'customer',
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return {
      success: true,
      user: newUser,
      message: 'রেজিস্ট্রেশন সফল হয়েছে!',
    };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = [...user.addresses, newAddress];
    setUser({ ...user, addresses: updatedAddresses });
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord))
    );
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAdmin,
        orders,
        userOrders: orders,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
