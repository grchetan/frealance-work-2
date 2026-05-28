import { Product, Order, User, Address, Review, AnalyticsData } from '../types';

// Read optional environmental configurations
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// --- SEED SEED DATA FOR SIMULATOR ---
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Heritage Golden Kachori (Pack of 4)',
    price: 120.0,
    description: "Jhabua's iconic recipe. Puffed crispy pastries filled with an heirloom spiced split-lentil and crushed fennel core. Served fresh with sweet tamarind and spicy mint chutneys.",
    category: 'Kachoris',
    image_url: '/images/golden_kachori.jpg',
    spice_level: 4,
    stock_quantity: 150,
    weight_options: ['Pack of 4', 'Pack of 8', 'Pack of 12'],
    ingredients: 'Refined Wheat Flour (Maida), Moong Dal, Fennel Seeds, Red Chilli Powder, Asafoetida (Hing), Spices, Pure Veg Oil.',
    is_featured: true,
    average_rating: 4.8,
    review_count: 1
  },
  {
    id: 2,
    name: 'Signature 12-Spice Kachori Masala',
    price: 180.0,
    description: "The soul of Jhabua's street food. A traditional blend of 12 hand-roasted, whole spices ground to perfection. Ideal for recreating authentic crispy kachoris and spicy curries at home.",
    category: 'Masalas',
    image_url: '/images/kachori_masala.jpg',
    spice_level: 5,
    stock_quantity: 300,
    weight_options: ['250g', '500g', '1kg'],
    ingredients: 'Dry Ginger, Coriander Seeds, Cumin Seeds, Fennel Seeds, Asafoetida (Hing), Black Salt, Black Pepper, Cinnamon, Cloves, Cardamom, Mace, Nutmeg.',
    is_featured: true,
    average_rating: 5.0,
    review_count: 1
  },
  {
    id: 3,
    name: 'Jhabua Shahi Pyaz Kachori (Pack of 4)',
    price: 140.0,
    description: 'Large, exceptionally flaky artisan kachoris packed with a rich, melt-in-mouth onion filling, crushed coriander seeds, and a secret spice paste. A sweet-and-spicy culinary marvel.',
    category: 'Kachoris',
    image_url: '/images/pyaz_kachori.png',
    spice_level: 3,
    stock_quantity: 80,
    weight_options: ['Pack of 4', 'Pack of 8'],
    ingredients: 'Wheat Flour, Chopped Sweet Onions, Gram Flour (Besan), Green Chillies, Coriander Seeds, Garam Masala, Traditional Herbs.',
    is_featured: true,
    average_rating: 0,
    review_count: 0
  },
  {
    id: 4,
    name: 'Spicy Dal Kachori Mix (Easy Cook)',
    price: 320.0,
    description: 'A pre-spiced dry flour stuffing mix. Just add warm water, roll inside dough, and fry. Serves up to 24 hot, delicious kachoris with our exact restaurant taste.',
    category: 'Masalas',
    image_url: '/images/dal_kachori_mix.png',
    spice_level: 4,
    stock_quantity: 200,
    weight_options: ['500g', '1kg'],
    ingredients: 'Dehydrated Moong Dal, Gram Flour, Red Chilli flakes, Crushed Fennel, Asafoetida, Citric Acid, Salt, Saffron hints.',
    is_featured: false,
    average_rating: 0,
    review_count: 0
  },
  {
    id: 5,
    name: 'Sweet Mawa Kachori (Pack of 2)',
    price: 150.0,
    description: 'A royal dessert kachori from Central India. Stuffed with pure condensed milk solids (Mawa), roasted almonds, pistachios, and saffron, then glazed in warm organic sugar syrup.',
    category: 'Snacks',
    image_url: '/images/sweet_mawa_kachori.png',
    spice_level: 1,
    stock_quantity: 5, // low stock testing
    weight_options: ['Pack of 2', 'Pack of 4'],
    ingredients: 'Refined Flour, Condensed Milk (Mawa), Almonds, Pistachios, Cashews, Saffron, Organic Cane Sugar, Pure Desi Ghee.',
    is_featured: false,
    average_rating: 0,
    review_count: 0
  },
  {
    id: 6,
    name: 'Heritage Gourmet Gifting Box',
    price: 450.0,
    description: 'A premium assortment designed for connoisseurs. Includes 1 fresh pack of Heritage Golden Kachoris, 1 jar of Signature 12-Spice Masala (250g), and a bottle of our sweet Date-Tamarind dipping syrup.',
    category: 'Combos',
    image_url: '/images/gourmet_gift_box.png',
    spice_level: 4,
    stock_quantity: 100,
    weight_options: ['Standard Gift Box'],
    ingredients: 'Contains Heritage Golden Kachori, Signature Masala, and Classic Date-Tamarind Sauce.',
    is_featured: true,
    average_rating: 0,
    review_count: 0
  }
];

const INITIAL_USERS = [
  {
    id: 'user-admin-uuid-2026',
    name: 'Mahesvari Admin',
    email: 'admin@mahesvari.com',
    role: 'admin' as const,
    phone: '+91 94254 78201'
  },
  {
    id: 'user-customer-uuid-2026',
    name: 'Rohan Sharma',
    email: 'customer@mahesvari.com',
    role: 'customer' as const,
    phone: '+91 99887 76655'
  }
];

const INITIAL_ADDRESSES = [
  {
    id: 101,
    user_id: 'user-customer-uuid-2026',
    street_address: '45, Heritage Chowk, Near Palace Gates',
    city: 'Jhabua',
    state: 'Madhya Pradesh',
    zip_code: '457661',
    is_default: 1
  }
];

const INITIAL_REVIEWS = [
  {
    id: 501,
    product_id: 1,
    user_name: 'Ananya Hegde',
    rating: 5,
    comment: 'Unbelievably crispy! The core masala is spicy and fragrant. Reminded me of my childhood visits to Jhabua. Shipped quickly and safely to Bangalore!',
    created_at: '2026-05-20T10:00:00Z'
  },
  {
    id: 502,
    product_id: 2,
    user_name: 'Rohan Sharma',
    rating: 5,
    comment: 'This masala is pure magic. Ground fennel and roasted coriander profiles are incredible. Elevates ordinary home curries completely.',
    created_at: '2026-05-24T14:30:00Z'
  }
];

// Database initialisation in LocalStorage
const setupSimulatorStorage = () => {
  const existingProducts = localStorage.getItem('sb_products');
  if (!existingProducts || existingProducts.includes('unsplash.com')) {
    localStorage.setItem('sb_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('sb_users')) {
    localStorage.setItem('sb_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('sb_addresses')) {
    localStorage.setItem('sb_addresses', JSON.stringify(INITIAL_ADDRESSES));
  }
  if (!localStorage.getItem('sb_reviews')) {
    localStorage.setItem('sb_reviews', JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem('sb_orders')) {
    localStorage.setItem('sb_orders', JSON.stringify([]));
  }
};

setupSimulatorStorage();

// --- SUPABASE SDK HIGH FIDELITY SIMULATOR ---
class SupabaseSimulator {
  auth = {
    signUp: async ({ email, password, options }: any) => {
      await this.delay(600);
      const users: any[] = JSON.parse(localStorage.getItem('sb_users') || '[]');
      if (users.find(u => u.email === email)) {
        return { data: { user: null }, error: { message: 'User already exists.' } };
      }

      const newUser = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        name: options?.data?.full_name || email.split('@')[0],
        email,
        role: 'customer' as const,
        phone: options?.data?.phone || ''
      };

      users.push(newUser);
      localStorage.setItem('sb_users', JSON.stringify(users));
      localStorage.setItem('sb_session_user', JSON.stringify(newUser));

      return { data: { user: newUser, session: { access_token: 'mock-jwt-token' } }, error: null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      await this.delay(500);
      const users: any[] = JSON.parse(localStorage.getItem('sb_users') || '[]');
      const matched = users.find(u => u.email === email);
      
      // Seed password check bypass for testing simplicity
      if (matched) {
        localStorage.setItem('sb_session_user', JSON.stringify(matched));
        return { data: { user: matched, session: { access_token: 'mock-jwt-token' } }, error: null };
      }
      return { data: { user: null, session: null }, error: { message: 'Invalid email or password.' } };
    },

    signOut: async () => {
      localStorage.removeItem('sb_session_user');
      return { error: null };
    },

    getUser: async () => {
      const active = localStorage.getItem('sb_session_user');
      return { data: { user: active ? JSON.parse(active) : null }, error: null };
    }
  };

  // Fluent query builder simulator
  from(table: string) {
    return new QueryBuilder(table);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Fluent Query Builder implementation
class QueryBuilder {
  private table: string;
  private data: any[];
  private filters: ((item: any) => boolean)[] = [];
  private sortField: string = '';
  private sortAscending: boolean = true;
  private limitCount: number = 0;
  private isSingle: boolean = false;

  constructor(table: string) {
    this.table = table;
    const key = `sb_${table}`;
    this.data = JSON.parse(localStorage.getItem(key) || '[]');
  }

  select(columns: string = '*') {
    // Fluent chains
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      if (column === 'user_id' || column === 'id' || column === 'product_id') {
        return item[column]?.toString() === value?.toString();
      }
      return item[column] === value;
    });
    return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.sortField = column;
    this.sortAscending = ascending;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(payload: any | any[]) {
    await this.delay(400);
    const key = `sb_${this.table}`;
    const items = Array.isArray(payload) ? payload : [payload];
    const newItems = items.map(item => ({
      id: item.id || Math.floor(Math.random() * 100000),
      created_at: new Date().toISOString(),
      ...item
    }));

    this.data = [...this.data, ...newItems];
    localStorage.setItem(key, JSON.stringify(this.data));

    return { data: this.isSingle ? newItems[0] : newItems, error: null };
  }

  async update(changes: any) {
    await this.delay(400);
    const key = `sb_${this.table}`;
    
    this.data = this.data.map(item => {
      // Check if item matches current filter chain
      const isMatch = this.filters.every(filter => filter(item));
      if (isMatch) {
        return { ...item, ...changes };
      }
      return item;
    });

    localStorage.setItem(key, JSON.stringify(this.data));
    return { data: this.data, error: null };
  }

  async delete() {
    await this.delay(300);
    const key = `sb_${this.table}`;
    this.data = this.data.filter(item => !this.filters.every(filter => filter(item)));
    localStorage.setItem(key, JSON.stringify(this.data));
    return { error: null };
  }

  async then(resolve: any) {
    // Execute query simulation
    await this.delay(300);
    let result = [...this.data];

    // Apply filters
    if (this.filters.length > 0) {
      result = result.filter(item => this.filters.every(filter => filter(item)));
    }

    // Apply sorting
    if (this.sortField) {
      result.sort((a, b) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        if (valA < valB) return this.sortAscending ? -1 : 1;
        if (valA > valB) return this.sortAscending ? 1 : -1;
        return 0;
      });
    }

    // Apply limits
    if (this.limitCount > 0) {
      result = result.slice(0, this.limitCount);
    }

    const payload = this.isSingle ? (result[0] || null) : result;
    resolve({ data: payload, error: null });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export Client Instance
// If Supabase keys are present in env, you can swap this for a real Supabase Client!
export const supabase = new SupabaseSimulator() as any;
