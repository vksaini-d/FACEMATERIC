'use client';

import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Results } from '@/hooks/useFaceDetection';
import FaceCanvas from './FaceCanvas';
import { Loader2 } from 'lucide-react';

interface CameraFeedProps {
    onVideoReady: (video: HTMLVideoElement) => void;
    results: Results | null;
    isLoading: boolean;
}

export default function CameraFeed({ onVideoReady, results, isLoading }: CameraFeedProps) {
    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        if (webcamRef.current && webcamRef.current.video) {
            onVideoReady(webcamRef.current.video);
        }
    }, [onVideoReady]);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden group">
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-electric-blue animate-spin mb-4" />
                    <p className="text-electric-blue font-mono text-sm animate-pulse">Initializing Neural Network...</p>
                </div>
            )}

            {/* Video Feed */}
            <Webcam
                ref={webcamRef}
                className="absolute inset-0 w-full h-full object-cover"
                mirrored
                audio={false}
                width={1280}
                height={720}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "user",
                    width: 1280,
                    height: 720
                }}
            />

            {/* Overlay Canvas */}
            <FaceCanvas results={results} mirror={true} />

            {/* UI Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-white/70 font-mono">
                    Face Tracking Active
                </div>
            </div>
        </div>
    );
}
