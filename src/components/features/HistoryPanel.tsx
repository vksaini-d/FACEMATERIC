import React from 'react';
import { HistoryItem } from '@/hooks/useHistory';
import { Trash2, Calendar, Activity } from 'lucide-react';

interface HistoryPanelProps {
    history: HistoryItem[];
    onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Activity className="w-12 h-12 mb-4 opacity-20" />
                <p>No analysis history yet.</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-antigravity-black p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Analysis History</h2>
                <button
                    onClick={onClear}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-antigravity-gray border border-antigravity-border rounded-xl p-5 hover:border-electric-blue/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-mono text-electric-blue px-2 py-1 rounded-full bg-electric-blue/10 uppercase">
                                    {item.type}
                                </span>
                                <h3 className="text-xl font-bold text-white mt-2">{item.shape}</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-400">{item.score}</div>
                                <div className="text-xs text-gray-500">Score</div>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-white/5 pt-4 mt-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Face Ratio</span>
                                <span className="font-mono text-white">{item.ratios.faceRatio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Date</span>
                                <span className="font-mono text-white flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
