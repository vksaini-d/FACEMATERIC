import React from 'react';
import { Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <header className="h-16 border-b border-antigravity-border bg-antigravity-black px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-3">
                <div className="bg-electric-blue/10 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-electric-blue" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                    Face<span className="text-electric-blue">Metric</span>
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-antigravity-border" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-antigravity-gray flex items-center justify-center border border-antigravity-border">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-300 hidden md:block">
                                {user.displayName || 'User'}
                            </span>
                        </div>
                        <button
                            onClick={signOut}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={signInWithGoogle}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
}
