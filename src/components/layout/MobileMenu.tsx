import React, { useState } from 'react';
import { Menu, X, Camera, Upload, Ruler, History } from 'lucide-react';
import { AppMode } from './Sidebar';
import clsx from 'clsx';

interface MobileMenuProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const NAV_ITEMS: { icon: any; label: string; mode: AppMode }[] = [
    { icon: Camera, label: 'Camera Analysis', mode: 'camera' },
    { icon: Upload, label: 'Photo Upload', mode: 'upload' },
    { icon: Ruler, label: 'Manual Input', mode: 'manual' },
    { icon: History, label: 'History', mode: 'history' },
];

export default function MobileMenu({ currentMode, onModeChange }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleModeChange = (mode: AppMode) => {
        onModeChange(mode);
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-14 sm:top-16 left-0 right-0 bg-antigravity-gray border-b border-antigravity-border z-50 md:hidden animate-in slide-in-from-top duration-200">
                        <nav className="p-4 space-y-2 max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.mode}
                                    onClick={() => handleModeChange(item.mode)}
                                    className={clsx(
                                        "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200",
                                        currentMode === item.mode
                                            ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Status Indicator */}
                        <div className="p-4 border-t border-antigravity-border">
                            <div className="bg-antigravity-black p-3 rounded-lg border border-antigravity-border">
                                <p className="text-xs text-gray-500 uppercase font-mono mb-1.5">System Status</p>
                                <div className="flex items-center gap-2 text-xs text-green-500 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
