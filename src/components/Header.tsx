import { Search, Bell } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex bg-neutral-900 rounded-full px-4 py-2 w-96 items-center gap-2 border border-neutral-800 focus-within:border-neutral-700 transition-colors">
                <Search size={16} className="text-neutral-500" />
                <input
                    type="text"
                    placeholder="Search tables, columns, or ask a question..."
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-neutral-600"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-900 cursor-pointer">
                    JD
                </div>
            </div>
        </header>
    );
}
