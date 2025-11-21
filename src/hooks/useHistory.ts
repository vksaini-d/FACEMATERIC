import { useState, useEffect } from 'react';
import { FaceShape } from '@/lib/analysis/faceShape';
import { GoldenRatioResult } from '@/lib/analysis/goldenRatio';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp, where } from 'firebase/firestore';

export interface HistoryItem {
    id: string;
    date: string;
    shape: FaceShape;
    score: number;
    ratios: GoldenRatioResult['ratios'];
    type: 'camera' | 'upload' | 'manual';
    userId?: string;
}

export const useHistory = (userId?: string) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setHistory([]);
            setLoading(false);
            return;
        }

        // Subscribe to real-time updates for specific user
        const q = query(
            collection(db, 'history'),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: HistoryItem[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    date: data.date,
                    shape: data.shape,
                    score: data.score,
                    ratios: data.ratios,
                    type: data.type,
                    userId: data.userId,
                });
            });
            setHistory(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching history:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addToHistory = async (item: Omit<HistoryItem, 'id' | 'date'>) => {
        if (!userId) return; // Don't save if not logged in (or save to local storage? for now just return)

        try {
            await addDoc(collection(db, 'history'), {
                ...item,
                userId,
                date: new Date().toISOString(),
                timestamp: Timestamp.now(),
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const clearHistory = async () => {
        console.warn("Clear history not fully implemented for Firestore (requires batch delete)");
        setHistory([]);
    };

    return { history, addToHistory, clearHistory, loading };
};
