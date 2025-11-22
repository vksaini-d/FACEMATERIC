'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Results } from '@/hooks/useFaceDetection';
import FaceCanvas from './FaceCanvas';
import { Loader2, Camera, X } from 'lucide-react';

interface CameraFeedProps {
    onVideoReady: (video: HTMLVideoElement) => void;
    results: Results | null;
    isLoading: boolean;
    onCapture?: (imageSrc: string) => void;
}

export default function CameraFeed({ onVideoReady, results, isLoading, onCapture }: CameraFeedProps) {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedDimensions, setCapturedDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (webcamRef.current && webcamRef.current.video && !capturedImage) {
            onVideoReady(webcamRef.current.video);
        }
    }, [onVideoReady, capturedImage]);

    const handleCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);

                // Get video dimensions for proper canvas overlay
                const video = webcamRef.current.video;
                if (video) {
                    setCapturedDimensions({
                        width: video.videoWidth,
                        height: video.videoHeight
                    });
                }

                // Notify parent component
                if (onCapture) {
                    onCapture(imageSrc);
                }
            }
        }
    };

    const handleClearCapture = () => {
        setCapturedImage(null);
        setCapturedDimensions({ width: 0, height: 0 });
        // Re-initialize video feed
        if (webcamRef.current && webcamRef.current.video) {
            onVideoReady(webcamRef.current.video);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden group">
            {/* Loading State */}
            {isLoading && !capturedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-electric-blue animate-spin mb-4" />
                    <p className="text-electric-blue font-mono text-sm animate-pulse">Initializing Neural Network...</p>
                </div>
            )}

            {/* Captured Image or Live Feed */}
            {capturedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: 'scaleX(-1)' }} // Mirror like webcam
                    />

                    {/* Clear Capture Button */}
                    <button
                        onClick={handleClearCapture}
                        className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors z-10 border border-white/20"
                        title="Clear Capture"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <>
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
                </>
            )}

            {/* Overlay Canvas */}
            <FaceCanvas results={results} mirror={true} />

            {/* Capture Button */}
            {!capturedImage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                    <button
                        onClick={handleCapture}
                        disabled={isLoading}
                        className="p-4 bg-electric-blue rounded-full text-white hover:bg-electric-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-electric-blue/50 border-2 border-white/20"
                        title="Capture Frame"
                    >
                        <Camera className="w-6 h-6" />
                    </button>
                    <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-white/70 font-mono flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${results?.multiFaceLandmarks?.length ? 'bg-green-500' : 'bg-red-500'}`} />
                        {results?.multiFaceLandmarks?.length ? 'Face Detected' : 'Searching...'}
                    </div>
                </div>
            )}
        </div>
    );
}
