import React from 'react';
import Header from './Header';
import Sidebar, { AppMode } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

export default function AppLayout({ children, currentMode, onModeChange }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-antigravity-black text-foreground font-sans selection:bg-electric-blue/30">
            <Header />
            <div className="flex">
                <Sidebar currentMode={currentMode} onModeChange={onModeChange} />
                <main className="flex-1 h-[calc(100vh-64px)] overflow-hidden bg-antigravity-black relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
