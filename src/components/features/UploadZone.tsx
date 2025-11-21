'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Results } from '@/hooks/useFaceDetection';
import FaceCanvas from './FaceCanvas';

interface UploadZoneProps {
    detectImage: (image: HTMLImageElement) => Promise<void>;
    results: Results | null;
    isLoading: boolean;
    isInitialized: boolean;
}

export default function UploadZone({ detectImage, results, isLoading, isInitialized }: UploadZoneProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = async () => {
        if (imageRef.current && isInitialized) {
            setDimensions({
                width: imageRef.current.clientWidth,
                height: imageRef.current.clientHeight
            });
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
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-antigravity-black border-2 border-dashed border-antigravity-border hover:border-electric-blue/50 transition-colors group">
            {!imageSrc ? (
                <div className="text-center p-10">
                    <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-electric-blue transition-colors" />
                    <p className="text-gray-400 font-medium mb-2">Drag & Drop or Click to Upload</p>
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
                <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Uploaded"
                        className="max-w-full max-h-full object-contain"
                        onLoad={onImageLoad}
                    />

                    {dimensions.width > 0 && (
                        <div style={{ width: dimensions.width, height: dimensions.height }} className="absolute pointer-events-none">
                            <FaceCanvas
                                results={results}
                                width={dimensions.width}
                                height={dimensions.height}
                                mirror={false}
                            />
                        </div>
                    )}

                    <button
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {(isLoading || !isInitialized) && imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                    <p className="text-electric-blue animate-pulse font-mono">
                        {!isInitialized ? 'Loading Model...' : 'Analyzing...'}
                    </p>
                </div>
            )}
        </div>
    );
}
