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
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const loadMediaPipe = async () => {
            try {
                // Dynamically import MediaPipe
                const FaceMeshModule = await import('@mediapipe/face_mesh');
                // @ts-ignore
                const FaceMeshConstructor = FaceMeshModule.FaceMesh || FaceMeshModule.default?.FaceMesh || window.FaceMesh;

                if (!FaceMeshConstructor) {
                    console.error('FaceMesh constructor not found');
                    setIsLoading(false);
                    return;
                }

                const faceMesh = new FaceMeshConstructor({
                    locateFile: (file: string) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
                    },
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.3, // Lowered for better detection
                    minTrackingConfidence: 0.3,
                });

                faceMesh.onResults((res: Results) => {
                    console.log('FaceMesh Results:', res.multiFaceLandmarks?.length);
                    setResults(res);
                    setIsLoading(false);
                });

                faceMeshRef.current = faceMesh;
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to load MediaPipe:', error);
                setIsLoading(false);
            }
        };

        loadMediaPipe();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, []);

    const onVideoReady = useCallback((videoElement: HTMLVideoElement) => {
        if (!faceMeshRef.current || !isInitialized) return;

        const sendFrame = async () => {
            if (faceMeshRef.current && videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                try {
                    await faceMeshRef.current.send({ image: videoElement });
                } catch (error) {
                    console.error('Error sending frame:', error);
                }
            }
            animationFrameRef.current = requestAnimationFrame(sendFrame);
        };

        sendFrame();
    }, [isInitialized]);

    const detectImage = useCallback(async (imageElement: HTMLImageElement) => {
        if (!faceMeshRef.current || !isInitialized) {
            console.warn('MediaPipe not initialized yet');
            return;
        }
        setIsLoading(true);
        try {
            await faceMeshRef.current.send({ image: imageElement });
            // Note: isLoading will be set to false by onResults callback
        } catch (error) {
            console.error('Error detecting image:', error);
            setIsLoading(false); // Only set false on error
        }
    }, [isInitialized]);

    const detectImageFromDataURL = useCallback(async (dataURL: string) => {
        if (!faceMeshRef.current || !isInitialized) {
            console.warn('MediaPipe not initialized yet');
            return;
        }

        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                setIsLoading(true);
                try {
                    await faceMeshRef.current!.send({ image: img });
                    resolve();
                } catch (error) {
                    console.error('Error detecting image from data URL:', error);
                    setIsLoading(false);
                    reject(error);
                }
            };
            img.onerror = () => {
                console.error('Failed to load image from data URL');
                reject(new Error('Failed to load image'));
            };
            img.src = dataURL;
        });
    }, [isInitialized]);

    const clearResults = useCallback(() => {
        setResults(null);
    }, []);

    return { results, isLoading, onVideoReady, detectImage, detectImageFromDataURL, isInitialized, clearResults };
};
