'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Sparkles } from 'lucide-react';
import { Results } from '@/hooks/useFaceDetection';
import FaceCanvas from './FaceCanvas';

interface UploadZoneProps {
    detectImage: (image: HTMLImageElement) => Promise<void>;
    results: Results | null;
    isLoading: boolean;
    isInitialized: boolean;
    clearResults: () => void;
}

export default function UploadZone({ detectImage, results, isLoading, isInitialized, clearResults }: UploadZoneProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target?.result as string);
                setHasAnalyzed(false); // Reset analysis state
                clearResults(); // Clear previous analysis results
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = () => {
        if (imageRef.current) {
            setDimensions({
                width: imageRef.current.clientWidth,
                height: imageRef.current.clientHeight
            });
        }
    };

    const handleAnalyze = async () => {
        if (imageRef.current && isInitialized) {
            setHasAnalyzed(true);
            // Small delay to ensure layout is stable
            setTimeout(async () => {
                if (imageRef.current) {
                    await detectImage(imageRef.current);
                }
            }, 100);
        }
    };

    const clearImage = () => {
        setImageSrc(null);
        setDimensions({ width: 0, height: 0 });
        setHasAnalyzed(false);
        clearResults();
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-antigravity-black border-2 border-dashed border-antigravity-border hover:border-electric-blue/50 transition-colors group">
            {!imageSrc ? (
                <div className="text-center p-6 sm:p-10 max-w-md">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4 group-hover:text-electric-blue transition-colors" />
                    <p className="text-gray-400 font-medium mb-2 text-sm sm:text-base">Drag & Drop or Click to Upload</p>
                    <p className="text-xs text-gray-600">Supports JPG, PNG (High Res recommended)</p>
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={handleFileChange}
                        disabled={!isInitialized}
                    />
                    {!isInitialized && (
                        <p className="text-xs text-yellow-500 mt-2">Initializing AI model...</p>
                    )}
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
                    <div className="relative flex-1 w-full flex items-center justify-center p-4">
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="Uploaded"
                            className="max-w-full max-h-full object-contain"
                            onLoad={onImageLoad}
                        />

                        {hasAnalyzed && dimensions.width > 0 && (
                            <div style={{ width: dimensions.width, height: dimensions.height }} className="absolute pointer-events-none">
                                <FaceCanvas
                                    results={results}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    mirror={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {!hasAnalyzed ? (
                            <button
                                onClick={handleAnalyze}
                                disabled={!isInitialized || isLoading}
                                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-electric-blue rounded-full text-white font-bold hover:bg-electric-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-electric-blue/50 border-2 border-white/20 text-sm sm:text-base"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                Analyze
                            </button>
                        ) : (
                            <button
                                onClick={clearImage}
                                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gray-700 rounded-full text-white font-bold hover:bg-gray-600 transition-all shadow-lg border-2 border-white/20 text-sm sm:text-base"
                            >
                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                Upload New
                            </button>
                        )}
                    </div>

                    {/* Clear Button (Top Right) */}
                    <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors z-10 border border-white/20"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            )}

            {(isLoading || !isInitialized) && imageSrc && hasAnalyzed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                    <p className="text-electric-blue animate-pulse font-mono text-sm sm:text-base px-4 text-center">
                        {!isInitialized ? 'Loading Model...' : 'Analyzing...'}
                    </p>
                </div>
            )}
        </div>
    );
}
