import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconHistory, IconTrash, IconChevronRight, IconLoader2, IconSearchOff, IconAlertCircle } from '@tabler/icons-react';

export const HistoryPage = ({ onRevisit }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load search history');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all your search history?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete('/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory([]);
        } catch (err) {
            alert('Failed to clear history');
            console.error(err);
        }
    };

    const handleDeleteSingle = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert('Failed to delete item');
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
                <IconLoader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your history...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-transparent p-6 md:p-12 relative z-10 font-sans transition-colors">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Search History</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Revisit your previous AI-powered analyses and comparisons.</p>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium shrink-0"
                        >
                            <IconTrash size={18} />
                            Clear History
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl p-6 flex flex-col items-center gap-3 text-center mb-6">
                        <IconAlertCircle className="text-red-500" size={32} />
                        <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        <button onClick={fetchHistory} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">Try Again</button>
                    </div>
                )}

                {history.length === 0 && !error ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-400 mb-6">
                            <IconSearchOff size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">No history found</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                            Your previous comparisons and data analyses will appear here once you start using the assistant.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => onRevisit && onRevisit(item)}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                                {item.category || 'All'}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                            {item.query}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 italic">
                                            "{item.response.introText}"
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSingle(item._id);
                                            }}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                            title="Delete history item"
                                        >
                                            <IconTrash size={18} />
                                        </button>
                                        <div className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors">
                                            <IconChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
