import React from 'react';
import { ScanFace } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 border-b border-antigravity-border bg-antigravity-black flex items-center px-6 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <ScanFace className="w-6 h-6 text-electric-blue" />
                <h1 className="text-xl font-bold tracking-tight text-white">
                    Face<span className="text-electric-blue">Metric</span>
                </h1>
            </div>
        </header>
    );
}
