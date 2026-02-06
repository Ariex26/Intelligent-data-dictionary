import React, { useState } from 'react';
import { Database, MessageSquare, Search, ShieldCheck, Activity, ChevronRight, Globe, Lock } from 'lucide-react';

// This is where your teammate's backend data will eventually go
const MOCK_DATA = {
  orders_master: {
    tableName: "orders_master",
    aiSummary: "Central table for all sales transactions. High importance for finance reports.",
    freshness: "12 mins ago",
    columns: [
      { name: "order_id", type: "UUID", desc: "Primary key for orders.", status: "Verified" },
      { name: "total_price", type: "DECIMAL", desc: "Total cost after discounts.", status: "Verified" }
    ]
  },
  users: {
    tableName: "users",
    aiSummary: "Contains sensitive user profiles and authentication metadata.",
    freshness: "1 hour ago",
    columns: [
      { name: "user_id", type: "INT", desc: "Internal user ID.", status: "Verified" },
      { name: "email", type: "VARCHAR", desc: "User primary contact.", status: "PII" }
    ]
  }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('docs');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar: Database Navigator */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-100">
            <Database size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">DataDictionary AI</span>
        </div>
        
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search schemas..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white border border-transparent focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Public Schema</div>
          {['users', 'orders_master', 'inventory', 'pricing_logs'].map(table => (
            <button 
              key={table} 
              className={`w-full text-left px-4 py-3 rounded-xl text-sm mb-1 flex items-center justify-between transition-all ${table === 'orders_master' ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm shadow-indigo-100' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <Database size={16} className={table === 'orders_master' ? 'text-indigo-600' : 'text-slate-400'} />
                {table}
              </div>
              {table === 'orders_master' && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Modern Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                <Globe size={18} />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{MOCK_TABLE_DATA.tableName}</h1>
               <p className="text-xs text-slate-500 font-medium">PostgreSQL • production_db • main_schema</p>
             </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button 
               onClick={() => setActiveTab('docs')}
               className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'docs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
               Documentation
             </button>
             <button 
               onClick={() => setActiveTab('chat')}
               className={`px-6 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
               <MessageSquare size={16} /> Ask AI
             </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
          
        {activeTab === 'docs' ? (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* AI Insight Highlight */}
    <section className="mb-10">
      <div className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MessageSquare size={80} className="text-indigo-600" />
        </div>
        <h2 className="text-indigo-900 font-bold mb-3 flex items-center gap-2 text-lg">
          <span className="bg-indigo-100 p-1 rounded">✨</span> AI Business Context
        </h2>
        <p className="text-slate-600 leading-relaxed text-lg max-w-3xl">
          {MOCK_TABLE_DATA.aiSummary}
        </p>
      </div>
    </section>

    {/* Metrics - Now only showing Freshness and Action */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
           <Activity size={14} className="text-blue-500"/> Freshness
         </div>
         <div className="text-3xl font-black text-slate-800">{MOCK_TABLE_DATA.freshness}</div>
         <p className="text-xs text-slate-400 mt-4">Last updated via CronJob #442</p>
      </div>

      <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 flex flex-col justify-center items-center text-white cursor-pointer hover:bg-indigo-700 transition-colors">
         <span className="font-bold text-sm">Generate SQL Query</span>
         <p className="text-indigo-100 text-xs text-center mt-1">Ask natural language questions about this table</p>
      </div>
    </section>

    {/* Technical Schema Grid */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Column Definitions</h3>
        <button className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4 tracking-tight">
          Export as Markdown
        </button>
      </div>
      {/* ... Table body remains the same ... */}
    </div>
    </div>
    ) : (

            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-20 animate-in zoom-in-95 duration-300">
               <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 mb-6">
                 <MessageSquare size={48} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Ask your Database</h2>
               <p className="text-slate-500 mb-8 leading-relaxed">Try asking things like "Which orders were above $500 last month?" or "List all customers with missing email addresses."</p>
               <div className="w-full relative group">
                  <input 
                    type="text" 
                    placeholder="Type your question..." 
                    className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg"
                  />
                  <button className="absolute right-3 top-3 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95">
                    Ask
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;