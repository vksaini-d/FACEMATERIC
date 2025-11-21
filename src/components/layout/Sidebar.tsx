import React from 'react';
import { LayoutDashboard, Camera, History, Settings, Upload, Ruler } from 'lucide-react';
import clsx from 'clsx';

export type AppMode = 'camera' | 'upload' | 'manual' | 'history' | 'settings';

interface SidebarProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const NAV_ITEMS: { icon: any; label: string; mode: AppMode }[] = [
    { icon: Camera, label: 'Camera Analysis', mode: 'camera' },
    { icon: Upload, label: 'Photo Upload', mode: 'upload' },
    { icon: Ruler, label: 'Manual Input', mode: 'manual' },
    { icon: History, label: 'History', mode: 'history' },
    // { icon: Settings, label: 'Settings', mode: 'settings' }, // Future implementation
];

export default function Sidebar({ currentMode, onModeChange }: SidebarProps) {
    return (
        <aside className="w-64 border-r border-antigravity-border bg-antigravity-gray h-[calc(100vh-64px)] hidden md:flex flex-col">
            <nav className="p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.mode}
                        onClick={() => onModeChange(item.mode)}
                        className={clsx(
                            "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200",
                            currentMode === item.mode
                                ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto p-4 border-t border-antigravity-border">
                <div className="bg-antigravity-black p-4 rounded-lg border border-antigravity-border">
                    <p className="text-xs text-gray-500 uppercase font-mono mb-2">System Status</p>
                    <div className="flex items-center gap-2 text-xs text-green-500 font-mono">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
