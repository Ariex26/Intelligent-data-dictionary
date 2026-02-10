import type { DatabaseConnection, TableSummary, ChatMessage } from '../types';

/**
 * API Service Layer
 * 
 * FRONTEND-BACKEND INTEGRATION INSTRUCTIONS:
 * 1. Replace the mock data and delay functions with actual HTTP calls (axios/fetch).
 * 2. Configure your BASE_URL (e.g., const BASE_URL = process.env.VITE_API_URL).
 * 3. Ensure the backend returns data matching the interfaces in `src/types/index.ts`.
 */

// Mock Data
const MOCK_CONNECTIONS: DatabaseConnection[] = [
    { id: '1', name: 'Production Snowflake', type: 'snowflake', host: 'sf-account.snowflakecomputing.com', port: 443, username: 'admin', database: 'SALES_DB', createdAt: new Date().toISOString(), status: 'connected' },
    { id: '2', name: 'Legacy Postgres', type: 'postgres', host: 'db.legacy.internal', port: 5432, username: 'read_only', database: 'ARCHIVE', createdAt: new Date().toISOString(), status: 'error' },
];

const MOCK_TABLES: TableSummary[] = [
    { id: 't1', name: 'CUSTOMERS', schema: 'PUBLIC', rowCount: 15420, columnCount: 12, description: 'Contains detailed customer profiles including PII.', healthScore: 98 },
    { id: 't2', name: 'ORDERS', schema: 'SALES', rowCount: 2500000, columnCount: 24, description: 'Transactional order history.', healthScore: 85 },
];

const API_DELAY = 800;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getConnections: async (): Promise<DatabaseConnection[]> => {
        await delay(API_DELAY);
        return MOCK_CONNECTIONS;
    },

    connectDatabase: async (data: Omit<DatabaseConnection, 'id' | 'createdAt' | 'status'>): Promise<DatabaseConnection> => {
        await delay(API_DELAY);
        // Simulating a connection check
        const isSuccess = Math.random() > 0.1;
        if (!isSuccess) throw new Error("Failed to connect to database host.");

        return {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'connected'
        };
    },

    getTables: async (): Promise<TableSummary[]> => {
        await delay(API_DELAY);
        return MOCK_TABLES;
    },

    getDashboardStats: async (): Promise<any> => {
        await delay(API_DELAY);
        return {
            totalConnections: MOCK_CONNECTIONS.length,
            totalTables: MOCK_TABLES.length,
            totalRows: MOCK_TABLES.reduce((acc, t) => acc + t.rowCount, 0),
            healthScore: 92
        };
    },

    askChat: async (message: string): Promise<ChatMessage> => {
        await delay(API_DELAY * 2);
        return {
            id: Math.random().toString(),
            role: 'assistant',
            content: `I understood your query about "${message}". Here is the data lineage for the CUSTOMERS table showing upstream dependencies from the raw landing zone.`,
            timestamp: Date.now()
        };
    }
};
