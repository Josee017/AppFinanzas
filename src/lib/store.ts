import { create } from 'zustand';
import { getDatabase } from './rxdb';

// --- Type Definitions ---

export interface Transaction {
    id: string;
    user_id: string;
    wallet_id: string;
    category_id: string;
    amount: number;
    date: string;
    note?: string;
    type: 'income' | 'expense'; // Added strict type
    attachment_url?: string;
    local_file_path?: string;
    created_at?: string;
    updated_at?: string;
    is_deleted?: boolean;
    sync_status?: 'pending' | 'synced';
}

export interface Wallet {
    id: string;
    user_id: string;
    name: string;
    type: string;
    initial_balance: number;
    current_balance?: number; // Calculated
    updated_at?: string;
}

export interface Category {
    id: string;
    user_id: string | null; // null for default/global
    name: string;
    icon: string;
    type: 'income' | 'expense';
    updated_at?: string;
}

interface AppState {
    transactions: Transaction[];
    wallets: Wallet[];
    categories: Category[];
    isLoading: boolean;
    currentUserId: string | null;

    setUserId: (id: string | null) => void;

    // Fetchers
    fetchTransactions: () => Promise<void>;
    fetchWallets: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchAll: () => Promise<void>;

    // Transaction CRUD
    addTransaction: (transaction: any) => Promise<void>;
    updateTransaction: (transaction: any) => Promise<void>;
    deleteTransaction: (id: string, softDelete?: boolean) => Promise<void>; // Updated signature

    // Wallet CRUD
    addWallet: (wallet: any) => Promise<void>;
    updateWallet: (wallet: any) => Promise<void>;
    deleteWallet: (id: string) => Promise<void>;

    // Category CRUD
    addCategory: (category: any) => Promise<void>;
    updateCategory: (category: any) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Theme
    themeMode: 'light' | 'dark';
    setThemeMode: (mode: 'light' | 'dark') => void;

    reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    transactions: [],
    wallets: [],
    categories: [],
    isLoading: false,
    currentUserId: null,
    themeMode: (localStorage.getItem('theme_mode') as 'light' | 'dark') || 'light', // Default to light or saved preference

    setUserId: (id: string | null) => set({ currentUserId: id }),

    fetchAll: async () => {
        const userId = get().currentUserId;
        if (!userId) return; // Don't fetch if no user

        set({ isLoading: true });
        try {
            console.log('Fetching all data for user:', userId);
            await Promise.all([
                get().fetchTransactions(),
                get().fetchWallets(),
                get().fetchCategories()
            ]);
            console.log('All data fetched.');
        } catch (error) {
            console.error('Error fetching all data:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTransactions: async () => {
        const userId = get().currentUserId;
        if (!userId) return;

        try {
            console.log('Fetching transactions...');
            const db = await getDatabase();
            const docs = await db.transactions.find({
                selector: {
                    user_id: userId,
                    is_deleted: { $ne: true }
                },
                sort: [{ date: 'desc' }]
            }).exec();
            console.log(`Fetched ${docs.length} transactions.`);
            set({ transactions: docs.map(doc => doc.toJSON()) });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    },

    fetchWallets: async () => {
        const userId = get().currentUserId;
        if (!userId) return;

        try {
            console.log('Fetching wallets...');
            const db = await getDatabase();
            const docs = await db.wallets.find({
                selector: {
                    user_id: userId
                }
            }).exec();
            console.log(`Fetched ${docs.length} wallets.`);
            set({ wallets: docs.map(doc => doc.toJSON()) });
        } catch (error) {
            console.error('Error fetching wallets:', error);
        }
    },

    fetchCategories: async () => {
        const userId = get().currentUserId;
        if (!userId) return;

        try {
            console.log('Fetching categories...');
            const db = await getDatabase();
            // Fetch user specific OR global categories (user_id is null)
            const docs = await db.categories.find({
                selector: {
                    $or: [
                        { user_id: userId },
                        { user_id: null }
                    ]
                }
            }).exec();
            console.log(`Fetched ${docs.length} categories.`);
            set({ categories: docs.map(doc => doc.toJSON()) });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },

    // --- Transaction Actions ---

    addTransaction: async (transaction) => {
        try {
            console.log('Adding transaction:', transaction);
            const db = await getDatabase();
            await db.transactions.insert({
                ...transaction,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                sync_status: 'pending'
            });
            console.log('Transaction added successfully.');
            await get().fetchTransactions();
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error; // Re-throw to handle in UI
        }
    },

    updateTransaction: async (transaction) => {
        try {
            console.log('Updating transaction:', transaction);
            const db = await getDatabase();
            const doc = await db.transactions.findOne(transaction.id).exec();
            if (doc) {
                await doc.patch({
                    ...transaction,
                    updated_at: new Date().toISOString(),
                    sync_status: 'pending'
                });
                console.log('Transaction updated.');
                await get().fetchTransactions();
            } else {
                console.warn('Transaction not found for update:', transaction.id);
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try {
            console.log('Deleting transaction:', id);
            const db = await getDatabase();
            const doc = await db.transactions.findOne(id).exec();
            if (doc) {
                // Soft delete to allow syncing deletion
                await doc.patch({
                    is_deleted: true,
                    updated_at: new Date().toISOString(),
                    sync_status: 'pending'
                });
                console.log('Transaction soft-deleted.');
            }
            await get().fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    },

    // --- Wallet Actions ---

    addWallet: async (wallet) => {
        try {
            console.log('Adding wallet:', wallet);
            const db = await getDatabase();
            await db.wallets.insert({
                ...wallet,
                updated_at: new Date().toISOString()
            });
            console.log('Wallet added.');
            await get().fetchWallets();
        } catch (error) {
            console.error('Error adding wallet:', error);
            throw error;
        }
    },

    updateWallet: async (wallet) => {
        try {
            console.log('Updating wallet:', wallet);
            const db = await getDatabase();
            const doc = await db.wallets.findOne(wallet.id).exec();
            if (doc) {
                await doc.patch({
                    ...wallet,
                    updated_at: new Date().toISOString()
                });
                console.log('Wallet updated.');
                await get().fetchWallets();
            }
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    },

    deleteWallet: async (id) => {
        try {
            console.log('Deleting wallet:', id);
            const db = await getDatabase();
            const doc = await db.wallets.findOne(id).exec();
            if (doc) await doc.remove();
            console.log('Wallet deleted.');
            await get().fetchWallets();
        } catch (error) {
            console.error('Error deleting wallet:', error);
            throw error;
        }
    },

    // --- Category Actions ---

    addCategory: async (category) => {
        try {
            console.log('Adding category:', category);
            const db = await getDatabase();
            await db.categories.insert({
                ...category,
                updated_at: new Date().toISOString()
            });
            console.log('Category added.');
            await get().fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    updateCategory: async (category) => {
        try {
            console.log('Updating category:', category);
            const db = await getDatabase();
            const doc = await db.categories.findOne(category.id).exec();
            if (doc) {
                await doc.patch({
                    ...category,
                    updated_at: new Date().toISOString()
                });
                console.log('Category updated.');
                await get().fetchCategories();
            }
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            console.log('Deleting category:', id);
            const db = await getDatabase();
            const doc = await db.categories.findOne(id).exec();
            if (doc) await doc.remove();
            console.log('Category deleted.');
            await get().fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    setThemeMode: (mode) => {
        set({ themeMode: mode });
        // Optional: Persist to localStorage for immediate restore before DB loads
        localStorage.setItem('theme_mode', mode);
    },

    reset: () => set({
        transactions: [],
        wallets: [],
        categories: [],
        isLoading: false,
        currentUserId: null
    })
}));
