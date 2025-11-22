'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Type definitions for MediaPipe
type NormalizedLandmark = {
    x: number;
    y: number;
    z: number;
};

export type Results = {
    multiFaceLandmarks: NormalizedLandmark[][];
    image: any;
};

type FaceMesh = {
    setOptions: (options: any) => void;
    onResults: (callback: (results: any) => void) => void;
    send: (inputs: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }) => Promise<void>;
    close: () => void;
};

export const useFaceDetection = () => {
    const [results, setResults] = useState<Results | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const loadMediaPipe = async () => {
            try {
                console.log('Loading MediaPipe FaceMesh...');
                // Dynamically import MediaPipe
                const FaceMeshModule = await import('@mediapipe/face_mesh');
                // @ts-ignore
                const FaceMeshConstructor = FaceMeshModule.FaceMesh || FaceMeshModule.default?.FaceMesh || window.FaceMesh;

                if (!FaceMeshConstructor) {
                    throw new Error('FaceMesh constructor not found');
                }

                const faceMesh = new FaceMeshConstructor({
                    locateFile: (file: string) => {
                        // Use the most reliable CDN URL for the binary assets
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                    },
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                faceMesh.onResults((res: Results) => {
                    console.log('FaceMesh Results Received:', res.multiFaceLandmarks?.length || 0, 'faces detected');
                    setResults(res);
                    setIsLoading(false);
                });

                await faceMesh.initialize(); // Ensure initialization if the method exists (it might not on all versions, but good to check docs, usually implicit)

                faceMeshRef.current = faceMesh;
                setIsInitialized(true);
                setIsLoading(false);
                console.log('MediaPipe FaceMesh Initialized');
            } catch (err: any) {
                console.error('Failed to load MediaPipe:', err);
                setError(err.message || 'Failed to load face detection model');
                setIsLoading(false);
            }
        };

        loadMediaPipe();

        return () => {
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, []);

    const onVideoReady = useCallback((videoElement: HTMLVideoElement) => {
        if (!faceMeshRef.current || !isInitialized) return;

        const sendFrame = async () => {
            if (faceMeshRef.current && videoElement && videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
                try {
                    await faceMeshRef.current.send({ image: videoElement });
                } catch (error) {
                    console.error('Error sending frame:', error);
                }
            }
            requestAnimationFrame(sendFrame);
        };

        sendFrame();
    }, [isInitialized]);

    const detectImage = useCallback(async (imageElement: HTMLImageElement) => {
        if (!faceMeshRef.current || !isInitialized) {
            console.warn('MediaPipe not initialized yet');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            // Add a timeout to prevent hanging
            const detectionPromise = faceMeshRef.current.send({ image: imageElement });
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Detection timed out')), 10000)
            );

            await Promise.race([detectionPromise, timeoutPromise]);
        } catch (error: any) {
            console.error('Error detecting image:', error);
            setError(error.message || 'Error detecting faces');
            setIsLoading(false);
        }
    }, [isInitialized]);

    const detectImageFromDataURL = useCallback(async (dataURL: string) => {
        if (!faceMeshRef.current || !isInitialized) {
            console.warn('MediaPipe not initialized yet');
            return;
        }
        setIsLoading(true);
        setError(null);

        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Important for some CDNs/sources
            img.onload = async () => {
                try {
                    await detectImage(img);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = (err) => {
                console.error('Failed to load image from Data URL');
                setError('Failed to process captured image');
                setIsLoading(false);
                reject(err);
            };
            img.src = dataURL;
        });
    }, [isInitialized, detectImage]);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return {
        results,
        isLoading,
        error,
        onVideoReady,
        detectImage,
        detectImageFromDataURL,
        isInitialized,
        clearResults
    };
};
