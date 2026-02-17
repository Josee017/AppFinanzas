import { createRxDatabase, addRxPlugin } from 'rxdb';
import type { RxDatabase, RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { ProfileSchema, WalletSchema, CategorySchema, TransactionSchema } from './schemas';

// Add plugins
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';

if (import.meta.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

// Define Database Type
export type FinanceDatabaseCollections = {
    profiles: RxCollection<any>;
    wallets: RxCollection<any>;
    categories: RxCollection<any>;
    transactions: RxCollection<any>;
};

export type FinanceDatabase = RxDatabase<FinanceDatabaseCollections>;

let dbPromise: Promise<FinanceDatabase> | null = null;

const _create = async (): Promise<FinanceDatabase> => {
    console.log('Database creating...');
    const db = await createRxDatabase<FinanceDatabaseCollections>({
        name: 'financeflow_db_v3',
        storage: wrappedValidateAjvStorage({
            storage: getRxStorageDexie()
        }),
        ignoreDuplicate: true
    });

    console.log('Database created');

    console.log('Database created');

    // Granular check for each collection to handle partial states
    const collectionsToAdd: any = {};

    if (!db.collections.profiles) {
        collectionsToAdd.profiles = { schema: ProfileSchema };
    }
    if (!db.collections.wallets) {
        collectionsToAdd.wallets = { schema: WalletSchema };
    }
    if (!db.collections.categories) {
        collectionsToAdd.categories = { schema: CategorySchema };
    }
    if (!db.collections.transactions) {
        collectionsToAdd.transactions = { schema: TransactionSchema };
    }

    // Only add if there are missing collections
    if (Object.keys(collectionsToAdd).length > 0) {
        try {
            await db.addCollections(collectionsToAdd);
            console.log('Collections added:', Object.keys(collectionsToAdd));
        } catch (error: any) {
            // DB9: Collection already exists
            if (error?.code === 'DB9' || error?.message?.includes('already exists')) {
                console.warn('Collections already existed (race condition handled):', error.message);
            } else {
                console.error('Error adding collections:', error);
                throw error;
            }
        }
    } else {
        console.log('All collections already initialized');
    }

    return db;
};

export const getDatabase = (): Promise<FinanceDatabase> => {
    if (!dbPromise) {
        dbPromise = _create();
    }
    return dbPromise;
};
