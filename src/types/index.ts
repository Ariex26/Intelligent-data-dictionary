export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export type DatabaseType = 'postgres' | 'snowflake' | 'mysql' | 'sqlserver';

export interface DatabaseConnection {
    id: string;
    name: string;
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    database: string;
    createdAt: string;
    status: 'connected' | 'disconnected' | 'error';
}

export interface TableSummary {
    id: string;
    name: string;
    schema: string;
    rowCount: number;
    columnCount: number;
    description?: string; // AI Generated
    healthScore?: number; // 0-100
}

export interface ColumnDetail {
    name: string;
    type: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    description?: string;
}

export interface TableDetail extends TableSummary {
    columns: ColumnDetail[];
    dataPreview?: Record<string, any>[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    relatedData?: any; // For charts or table snippets
}

export interface DashboardStats {
    totalConnections: number;
    totalTables: number;
    totalRows: number;
    healthScore: number;
}
