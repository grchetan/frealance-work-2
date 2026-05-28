// Hybrid Firebase Authentication Service & Simulator Broker
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';

// Read Firebase configuration from environmental variables
const FIREBASE_API_KEY = import.meta.env?.VITE_FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '';
const FIREBASE_PROJECT_ID = import.meta.env?.VITE_FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET = import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const FIREBASE_APP_ID = import.meta.env?.VITE_FIREBASE_APP_ID || '';

export const isFirebaseConfigured = !!(FIREBASE_API_KEY && FIREBASE_AUTH_DOMAIN);

let firebaseAuthInstance: any = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID
    };
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseAuthInstance = getAuth(app);
  } catch (err) {
    console.error('Firebase Auth initialization failed:', err);
  }
}

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
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  triggerStateChange() {
    const user = this.currentUser;
    this.listeners.forEach(callback => callback(user));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createUserWithEmailAndPassword(email: string, passwordSecured: string, signupData: { displayName: string; phone: string }) {
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

    // Seed into Supabase users table as well to keep relational simulation cohesive
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

  async signInWithEmailAndPassword(email: string, passwordSecured: string) {
    await this.delay(500);
    const users: FirebaseUser[] = JSON.parse(localStorage.getItem('fb_users') || '[]');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      throw new Error('Authentication failed. No user found matching these credentials.');
    }

    // Direct password checking simulation for demonstration
    if (email === 'admin@mahesvari.com' && passwordSecured !== 'admin123') {
      throw new Error('Invalid administrator credential password.');
    }
    if (email === 'customer@mahesvari.com' && passwordSecured !== 'customer123') {
      throw new Error('Invalid account password credentials.');
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

const authSimulator = new FirebaseAuthSimulator();

// --- 6. SECURE HYBRID AUTHENTICATION AGENT ROUTER ---
class FirebaseAuthService {
  onAuthStateChanged(callback: (user: any | null) => void) {
    if (isFirebaseConfigured && firebaseAuthInstance) {
      return fbOnAuthStateChanged(firebaseAuthInstance, async (fbUser) => {
        if (fbUser) {
          // Map Firebase user fields to application model
          callback({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || '',
            phone: fbUser.phoneNumber || '',
            // Fallback rules: standard admin check or user role sync
            role: fbUser.email === 'admin@mahesvari.com' ? 'admin' : 'customer',
            created_at: fbUser.metadata.creationTime || new Date().toISOString()
          });
        } else {
          callback(null);
        }
      });
    } else {
      return authSimulator.onAuthStateChanged(callback);
    }
  }

  get currentUser(): any {
    if (isFirebaseConfigured && firebaseAuthInstance) {
      const fbUser = firebaseAuthInstance.currentUser;
      if (!fbUser) return null;
      return {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        phone: fbUser.phoneNumber || '',
        role: fbUser.email === 'admin@mahesvari.com' ? 'admin' : 'customer',
        created_at: fbUser.metadata.creationTime || new Date().toISOString()
      };
    } else {
      return authSimulator.currentUser;
    }
  }

  async createUserWithEmailAndPassword(email: string, passwordSecured: string, signupData: { displayName: string; phone: string }) {
    if (isFirebaseConfigured && firebaseAuthInstance) {
      const userCredential = await fbCreateUser(firebaseAuthInstance, email, passwordSecured);
      const fbUser = userCredential.user;
      
      // Update basic profile details
      await fbUpdateProfile(fbUser, {
        displayName: signupData.displayName
      });

      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: signupData.displayName,
          phone: signupData.phone || '',
          role: 'customer' as const,
          created_at: fbUser.metadata.creationTime || new Date().toISOString()
        }
      };
    } else {
      return authSimulator.createUserWithEmailAndPassword(email, passwordSecured, signupData);
    }
  }

  async signInWithEmailAndPassword(email: string, passwordSecured: string) {
    if (isFirebaseConfigured && firebaseAuthInstance) {
      const userCredential = await fbSignIn(firebaseAuthInstance, email, passwordSecured);
      const fbUser = userCredential.user;
      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || '',
          phone: fbUser.phoneNumber || '',
          role: fbUser.email === 'admin@mahesvari.com' ? 'admin' : 'customer',
          created_at: fbUser.metadata.creationTime || new Date().toISOString()
        }
      };
    } else {
      return authSimulator.signInWithEmailAndPassword(email, passwordSecured);
    }
  }

  async signOut() {
    if (isFirebaseConfigured && firebaseAuthInstance) {
      await fbSignOut(firebaseAuthInstance);
      return { error: null };
    } else {
      return authSimulator.signOut();
    }
  }
}

// Export Auth Service broker
export const auth = new FirebaseAuthService();
