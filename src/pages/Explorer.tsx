import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { TableSummary } from '../types';
import { Search, Database, Table2, Columns, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';

export function Explorer() {
    const [tables, setTables] = useState<TableSummary[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'columns' | 'preview'>('overview');

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            setLoading(true);
            const data = await api.getTables();
            setTables(data);
            if (data.length > 0 && !selectedTableId) {
                setSelectedTableId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load tables", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTables = tables.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.schema.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedTable = tables.find(t => t.id === selectedTableId);

    // Mock column data generator since our API only returns summary for now
    // In a real app, we would fetch /tables/:id/details
    const getMockColumns = (table: TableSummary) => {
        const commonCols = [
            { name: 'ID', type: 'VARCHAR(36)', isNullable: false, isPrimaryKey: true, description: 'Unique identifier' },
            { name: 'CREATED_AT', type: 'TIMESTAMP_NTZ', isNullable: false, isPrimaryKey: false, description: 'Record creation timestamp' },
            { name: 'UPDATED_AT', type: 'TIMESTAMP_NTZ', isNullable: true, isPrimaryKey: false, description: 'Last update timestamp' },
        ];

        if (table.name === 'CUSTOMERS') {
            return [
                ...commonCols,
                { name: 'EMAIL', type: 'VARCHAR(255)', isNullable: false, isPrimaryKey: false, description: 'Customer email address (PII)' },
                { name: 'FULL_NAME', type: 'VARCHAR(100)', isNullable: true, isPrimaryKey: false, description: 'Full name' },
                { name: 'STATUS', type: 'VARCHAR(20)', isNullable: false, isPrimaryKey: false, description: 'Account status' },
            ];
        }
        return [
            ...commonCols,
            { name: 'AMOUNT', type: 'DECIMAL(10,2)', isNullable: false, isPrimaryKey: false, description: 'Order total amount' },
            { name: 'STATUS', type: 'VARCHAR(20)', isNullable: false, isPrimaryKey: false, description: 'Order status' },
        ];
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] -m-4">
            {/* Sidebar List */}
            <div className="w-80 border-r border-neutral-800 flex flex-col bg-neutral-900/30">
                <div className="p-4 border-b border-neutral-800">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                        <Input
                            placeholder="Search tables..."
                            className="pl-9 bg-neutral-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-2 space-y-1">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin h-5 w-5 text-neutral-500" />
                        </div>
                    ) : (
                        filteredTables.map(table => (
                            <button
                                key={table.id}
                                onClick={() => setSelectedTableId(table.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                    selectedTableId === table.id
                                        ? "bg-blue-600/10 text-blue-400"
                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                                )}
                            >
                                <Table2 size={16} />
                                <div className="text-left overflow-hidden">
                                    <div className="font-medium truncate">{table.name}</div>
                                    <div className="text-xs text-neutral-600 truncate">{table.schema}</div>
                                </div>
                                {selectedTableId === table.id && <ChevronRight size={14} className="ml-auto" />}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
                {selectedTable ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-800 bg-neutral-900/10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                        <Table2 size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            {selectedTable.name}
                                            <Badge variant="outline" className="text-xs font-normal text-neutral-400 border-neutral-700">
                                                {selectedTable.schema}
                                            </Badge>
                                        </h2>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                                            <span className="flex items-center gap-1">
                                                <Columns size={14} /> {selectedTable.columnCount} columns
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Database size={14} /> {selectedTable.rowCount.toLocaleString()} rows
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-neutral-400 mb-1">Health Score</div>
                                    <div className="text-xl font-bold text-green-500">{selectedTable.healthScore}%</div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-6 mt-8 border-b border-neutral-800">
                                {['overview', 'columns', 'preview'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={cn(
                                            "pb-3 text-sm font-medium border-b-2 transition-colors capitalize",
                                            activeTab === tab
                                                ? "border-blue-500 text-blue-400"
                                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-auto p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6 max-w-4xl">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText size={18} className="text-blue-400" />
                                                AI Documentation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-neutral-300 leading-relaxed">
                                                {selectedTable.description}
                                                <br /><br />
                                                This table serves as the central repository for entity information.
                                                It is joined frequently with <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs">ORDERS</code> for billing analysis.
                                                Data quality is generally high, though email validation failures occur in 0.5% of records.
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm text-neutral-400">Tags</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex gap-2">
                                                <Badge variant="secondary">Core</Badge>
                                                <Badge variant="secondary">PII</Badge>
                                                <Badge variant="secondary">Validated</Badge>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm text-neutral-400">Owner</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-500 to-blue-500" />
                                                <span className="text-sm">Data Engineering Team</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'columns' && (
                                <div className="rounded-lg border border-neutral-800 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-neutral-900/50 text-neutral-400 font-medium">
                                            <tr>
                                                <th className="px-4 py-3 border-b border-neutral-800">Column Name</th>
                                                <th className="px-4 py-3 border-b border-neutral-800">Type</th>
                                                <th className="px-4 py-3 border-b border-neutral-800">Attributes</th>
                                                <th className="px-4 py-3 border-b border-neutral-800">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800">
                                            {getMockColumns(selectedTable).map((col, idx) => (
                                                <tr key={idx} className="hover:bg-neutral-900/30 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-white">{col.name}</td>
                                                    <td className="px-4 py-3 text-blue-400 font-mono text-xs">{col.type}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-1">
                                                            {col.isPrimaryKey && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20">PK</span>}
                                                            {col.isNullable && <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">NULL</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-neutral-400">{col.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'preview' && (
                                <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
                                    <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
                                    <p>Data preview requires active database connection.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                        <Table2 className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a table to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
