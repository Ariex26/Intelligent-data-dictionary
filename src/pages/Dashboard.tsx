import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { DashboardStats, DatabaseConnection } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Database, Table2, Activity, HardDrive } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentConnections, setRecentConnections] = useState<DatabaseConnection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, connectionsData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getConnections()
                ]);
                setStats(statsData);
                setRecentConnections(connectionsData.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-500">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-neutral-400">Overview of your data landscape.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Connections</CardTitle>
                        <Database className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalConnections || 0}</div>
                        <p className="text-xs text-neutral-500 mt-1">+1 from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Tables</CardTitle>
                        <Table2 className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalTables || 0}</div>
                        <p className="text-xs text-neutral-500 mt-1">Across all connections</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Rows Processed</CardTitle>
                        <HardDrive className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats?.totalRows || 0).toLocaleString()}</div>
                        <p className="text-xs text-neutral-500 mt-1">Estimated volume</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.healthScore || 0}%</div>
                        <p className="text-xs text-neutral-500 mt-1">Operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Recent Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentConnections.map((conn) => (
                                <div key={conn.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-neutral-900 rounded-md text-blue-400">
                                            <Database size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{conn.name}</p>
                                            <p className="text-xs text-neutral-400">{conn.host}</p>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${conn.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {conn.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Activity size={16} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-white text-sm">Schema Sync</div>
                                            <time className="font-caveat font-medium text-xs text-neutral-500">10:3{i} AM</time>
                                        </div>
                                        <div className="text-neutral-400 text-xs">Updated metadata for SALES_DB. Found 2 new columns.</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
