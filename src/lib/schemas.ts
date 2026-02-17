import type { RxJsonSchema } from 'rxdb';

export const ProfileSchema: RxJsonSchema<any> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        email: { type: 'string', maxLength: 100 },
        avatar_url: { type: 'string', maxLength: 255 },
        preferred_currency: { type: 'string', maxLength: 10 },
        language: { type: 'string', maxLength: 10 },
        updated_at: { type: 'string', maxLength: 40 }
    },
    required: ['id', 'email']
};

export const WalletSchema: RxJsonSchema<any> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        user_id: { type: 'string', maxLength: 100 },
        name: { type: 'string', maxLength: 100 },
        type: { type: 'string', maxLength: 50 },
        initial_balance: { type: 'number' },
        current_balance: { type: 'number' },
        updated_at: { type: 'string', maxLength: 40 }
    },
    required: ['id', 'user_id', 'name']
};

export const CategorySchema: RxJsonSchema<any> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        user_id: { type: ['string', 'null'], maxLength: 100 },
        name: { type: 'string', maxLength: 100 },
        icon: { type: 'string', maxLength: 50 },
        type: { type: 'string', enum: ['income', 'expense'], maxLength: 20 },
        updated_at: { type: 'string', maxLength: 40 }
    },
    required: ['id', 'name', 'type']
};

export const TransactionSchema: RxJsonSchema<any> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        user_id: { type: 'string', maxLength: 100 },
        wallet_id: { type: 'string', maxLength: 100 },
        category_id: { type: 'string', maxLength: 100 },
        amount: { type: 'number' },
        date: { type: 'string', format: 'date-time', maxLength: 40 },
        note: { type: 'string', maxLength: 500 },
        type: { type: 'string', enum: ['income', 'expense'], maxLength: 20 },
        attachment_url: { type: 'string', maxLength: 255 },
        local_file_path: { type: 'string', maxLength: 255 },
        created_at: { type: 'string', format: 'date-time', maxLength: 40 },
        updated_at: { type: 'string', format: 'date-time', maxLength: 40 },
        is_deleted: { type: 'boolean', default: false },
        sync_status: { type: 'string', enum: ['pending', 'synced'], default: 'pending', maxLength: 20 }
    },
    required: ['id', 'user_id', 'wallet_id', 'category_id', 'amount', 'date', 'updated_at', 'sync_status'],
    indexes: ['date', 'updated_at', 'sync_status']
};
