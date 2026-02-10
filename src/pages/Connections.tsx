import { useState, useEffect } from 'react';
import { Plus, Database, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { DatabaseConnection, DatabaseType } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function Connections() {
    const [connections, setConnections] = useState<DatabaseConnection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'snowflake' as DatabaseType,
        host: '',
        port: 443,
        username: '',
        database: '',
        password: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadConnections();
    }, []);

    const loadConnections = async () => {
        try {
            setLoading(true);
            const data = await api.getConnections();
            setConnections(data);
        } catch (error) {
            console.error("Failed to load connections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const newConnection = await api.connectDatabase({
                ...formData,
                port: Number(formData.port)
            });
            setConnections([...connections, newConnection]);
            setIsModalOpen(false);
            // Reset form
            setFormData({
                name: '',
                type: 'snowflake',
                host: '',
                port: 443,
                username: '',
                database: '',
                password: ''
            });
        } catch (error) {
            alert("Failed to connect: " + error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredConnections = connections.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.host.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Connections</h1>
                    <p className="text-neutral-400">Manage your database connections</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Connection
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 w-full max-w-md">
                <Search className="ml-3 h-4 w-4 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Search connections..."
                    className="bg-transparent border-none focus:outline-none text-sm text-neutral-200 w-full p-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 text-neutral-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConnections.map((conn) => (
                        <Card key={conn.id} className="hover:border-blue-500/50 transition-colors group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {conn.name}
                                </CardTitle>
                                <Badge variant={conn.status === 'connected' ? 'success' : 'destructive'} className="uppercase text-[10px]">
                                    {conn.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-neutral-800 rounded-md text-blue-400">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500 uppercase font-semibold">{conn.type}</div>
                                        <div className="text-sm text-neutral-300 truncate w-40" title={conn.host}>{conn.host}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <CheckCircle2 size={12} className={conn.status === 'connected' ? "text-green-500" : "text-red-500"} />
                                    Last synced: Just now
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredConnections.length === 0 && (
                        <div className="col-span-full text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                            No connections found.
                        </div>
                    )}
                </div>
            )}

            {/* Add Connection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md border-neutral-700 bg-neutral-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle className="text-xl">Add New Connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleConnect} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Database Type</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as DatabaseType })}
                                    >
                                        <option value="snowflake">Snowflake</option>
                                        <option value="postgres">PostgreSQL</option>
                                        <option value="mysql">MySQL</option>
                                        <option value="sqlserver">SQL Server</option>
                                    </select>
                                </div>

                                <Input
                                    label="Connection Name"
                                    placeholder="e.g. Production DB"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Host"
                                        placeholder="hostname"
                                        value={formData.host}
                                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Port"
                                        type="number"
                                        placeholder="5432"
                                        value={formData.port}
                                        onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Database Name"
                                    placeholder="db_name"
                                    value={formData.database}
                                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Username"
                                        placeholder="user"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={formLoading}>Connect Database</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
