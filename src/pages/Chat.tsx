import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { ChatMessage } from '../types';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I can help you understand your database schema and data quality. Ask me anything!',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.askChat(userMessage.content);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request.',
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "Show me all table with 'user' in name",
        "Analyze data quality for ORDERS table",
        "Explain relationships between CUSTOMERS and ORDERS",
        "List tables with PII data"
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="font-semibold text-white">Data Architect Assistant</h2>
                    <p className="text-xs text-neutral-400">Powered by Gemini</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-4 max-w-3xl",
                            message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            message.role === 'user' ? "bg-blue-600" : "bg-purple-600"
                        )}>
                            {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={cn(
                            "rounded-2xl px-5 py-3 text-sm leading-relaxed",
                            message.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-neutral-800 text-neutral-200 rounded-tl-none"
                        )}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 mr-auto">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-neutral-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1">
                            <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
                {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setInput(suggestion)}
                                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-full transition-colors border border-neutral-700"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your data..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="rounded-xl h-[46px] w-[46px] p-0"
                    >
                        <Send size={18} />
                    </Button>
                </form>
                <p className="text-center text-[10px] text-neutral-600 mt-2">
                    AI can make mistakes. Verify important information using the Schema Explorer.
                </p>
            </div>
        </div>
    );
}
