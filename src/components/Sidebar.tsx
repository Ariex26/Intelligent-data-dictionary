import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Table2, MessageSquareText, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Database, label: 'Connections', path: '/connections' },
    { icon: Table2, label: 'Schema Explorer', path: '/explorer' },
    { icon: MessageSquareText, label: 'AI Chat', path: '/chat' },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    DataPulse
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-colors w-full">
                    <Settings size={20} />
                    Settings
                </button>
            </div>
        </div>
    );
}
