// Hybrid Firebase Authentication Service & Simulator Broker
import { User } from '../types';

// Read optional Firebase configuration from environmental variables
const FIREBASE_API_KEY = import.meta.env?.VITE_FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '';

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: 'customer' | 'admin';
  created_at: string;
}

// --- SEED USER ACCOUNTS FOR FIREBASE SIMULATOR ---
const SEED_FIREBASE_USERS: FirebaseUser[] = [
  {
    uid: 'user-customer-uuid-2026', // matches Supabase seeded user ID for relational bounds
    email: 'customer@mahesvari.com',
    displayName: 'Rohan Sharma',
    phone: '+91 99887 76655',
    role: 'customer',
    created_at: '2026-05-20T10:00:00Z'
  },
  {
    uid: 'user-admin-uuid-2026', // matches Supabase seeded admin ID
    email: 'admin@mahesvari.com',
    displayName: 'Mahesvari Admin',
    phone: '+91 94254 78201',
    role: 'admin',
    created_at: '2026-05-20T10:00:00Z'
  }
];

const initSimulator = () => {
  if (!localStorage.getItem('fb_users')) {
    localStorage.setItem('fb_users', JSON.stringify(SEED_FIREBASE_USERS));
  }
};

initSimulator();

class FirebaseAuthSimulator {
  private listeners: ((user: any | null) => void)[] = [];

  constructor() {
    // Monitor session boot state and automatically trigger auth state change triggers
    setTimeout(() => {
      this.triggerStateChange();
    }, 100);
  }

  get currentUser(): FirebaseUser | null {
    const session = localStorage.getItem('fb_session_user');
    return session ? JSON.parse(session) : null;
  }

  onAuthStateChanged(callback: (user: any | null) => void) {
    this.listeners.push(callback);
    // Initial call
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private triggerStateChange() {
    const user = this.currentUser;
    this.listeners.forEach(callback => callback(user));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createUserWithEmailAndPassword(email: string, signupData: { displayName: string; phone: string }) {
    await this.delay(500);
    const users: FirebaseUser[] = JSON.parse(localStorage.getItem('fb_users') || '[]');

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: FirebaseUser = {
      uid: 'fb-' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      displayName: signupData.displayName,
      phone: signupData.phone || '',
      role: 'customer',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('fb_users', JSON.stringify(users));
    localStorage.setItem('fb_session_user', JSON.stringify(newUser));

    // Seed into Supabase users table as well to keep relational simulation cohesive!
    const sbUsers = JSON.parse(localStorage.getItem('sb_users') || '[]');
    if (!sbUsers.find((u: any) => u.email === email)) {
      sbUsers.push({
        id: newUser.uid,
        name: newUser.displayName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        created_at: newUser.created_at
      });
      localStorage.setItem('sb_users', JSON.stringify(sbUsers));
    }

    this.triggerStateChange();
    return { user: newUser };
  }

  async signInWithEmailAndPassword(email: string) {
    await this.delay(500);
    const users: FirebaseUser[] = JSON.parse(localStorage.getItem('fb_users') || '[]');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      throw new Error('Authentication failed. No user found matching these credentials.');
    }

    localStorage.setItem('fb_session_user', JSON.stringify(matched));
    this.triggerStateChange();
    return { user: matched };
  }

  async signOut() {
    await this.delay(300);
    localStorage.removeItem('fb_session_user');
    this.triggerStateChange();
    return { error: null };
  }
}

// Export Auth Service broker
// If Firebase Web SDK keys are supplied, you can swap this class instance for standard Firebase Auth SDK calls!
export const auth = new FirebaseAuthSimulator();
