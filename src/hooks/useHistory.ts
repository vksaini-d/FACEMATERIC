import { useState, useEffect } from 'react';
import { FaceShape } from '@/lib/analysis/faceShape';
import { GoldenRatioResult } from '@/lib/analysis/goldenRatio';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

export interface HistoryItem {
    id: string;
    date: string;
    shape: FaceShape;
    score: number;
    ratios: GoldenRatioResult['ratios'];
    type: 'camera' | 'upload' | 'manual';
}

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to real-time updates
        const q = query(
            collection(db, 'history'),
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
                });
            });
            setHistory(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching history:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addToHistory = async (item: Omit<HistoryItem, 'id' | 'date'>) => {
        try {
            await addDoc(collection(db, 'history'), {
                ...item,
                date: new Date().toISOString(),
                timestamp: Timestamp.now(),
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const clearHistory = async () => {
        // Note: Deleting collections from client is not recommended/easy in Firestore.
        // We would typically delete documents one by one or use a Cloud Function.
        // For this demo, we'll just clear the local state visually or implement a batch delete if needed.
        // Keeping it simple: Log a warning that server-side clear is needed.
        console.warn("Clear history not fully implemented for Firestore (requires batch delete)");
        setHistory([]);
    };

    return { history, addToHistory, clearHistory, loading };
};
