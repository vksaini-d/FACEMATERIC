import React from 'react';
import { Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <header className="h-14 sm:h-16 border-b border-antigravity-border bg-antigravity-black px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-electric-blue/10 p-1.5 sm:p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-electric-blue" />
                </div>
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
                    Face<span className="text-electric-blue">Metric</span>
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {user ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-antigravity-border" />
                            ) : (
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-antigravity-gray flex items-center justify-center border border-antigravity-border">
                                    <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                </div>
                            )}
                            <span className="text-xs sm:text-sm font-medium text-gray-300 hidden md:block max-w-[100px] lg:max-w-none truncate">
                                {user.displayName || 'User'}
                            </span>
                        </div>
                        <button
                            onClick={signOut}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={signInWithGoogle}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-full text-xs sm:text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                        <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Sign In</span>
                        <span className="xs:hidden">Login</span>
                    </button>
                )}
            </div>
        </header>
    );
}
