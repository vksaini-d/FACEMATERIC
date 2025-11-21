import React, { useState } from 'react';
import { Ruler, Calculator } from 'lucide-react';
import { calculateFaceShapeFromDimensions, FaceShape } from '@/lib/analysis/faceShape';

interface ManualInputProps {
    onCalculate: (shape: FaceShape, ratioScore: number) => void;
}

export default function ManualInput({ onCalculate }: ManualInputProps) {
    const [measurements, setMeasurements] = useState({
        faceLength: '',
        cheekWidth: '',
        jawWidth: '',
        foreheadWidth: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMeasurements({
            ...measurements,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const length = parseFloat(measurements.faceLength);
        const cheek = parseFloat(measurements.cheekWidth);
        const jaw = parseFloat(measurements.jawWidth);
        const forehead = parseFloat(measurements.foreheadWidth);

        if (isNaN(length) || isNaN(cheek) || isNaN(jaw) || isNaN(forehead)) return;

        const shape = calculateFaceShapeFromDimensions(length, cheek, jaw, forehead);

        // Simple ratio calc for manual input (Length / Width)
        const ratio = length / cheek;
        const phi = 1.618;
        const deviation = Math.abs(ratio - phi);
        const score = Math.max(0, 100 * (1 - deviation / phi));

        onCalculate(shape, Math.round(score));
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-antigravity-black p-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Ruler className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Manual Measurements</h2>
                    <p className="text-gray-400 mt-2">Enter your facial dimensions in cm or inches.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Face Length</label>
                            <input
                                type="number"
                                name="faceLength"
                                value={measurements.faceLength}
                                onChange={handleChange}
                                className="w-full bg-black border border-antigravity-border rounded-lg px-4 py-3 text-white focus:border-electric-blue focus:outline-none transition-colors"
                                placeholder="0.0"
                                step="0.1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Cheek Width</label>
                            <input
                                type="number"
                                name="cheekWidth"
                                value={measurements.cheekWidth}
                                onChange={handleChange}
                                className="w-full bg-black border border-antigravity-border rounded-lg px-4 py-3 text-white focus:border-electric-blue focus:outline-none transition-colors"
                                placeholder="0.0"
                                step="0.1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Jaw Width</label>
                            <input
                                type="number"
                                name="jawWidth"
                                value={measurements.jawWidth}
                                onChange={handleChange}
                                className="w-full bg-black border border-antigravity-border rounded-lg px-4 py-3 text-white focus:border-electric-blue focus:outline-none transition-colors"
                                placeholder="0.0"
                                step="0.1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Forehead Width</label>
                            <input
                                type="number"
                                name="foreheadWidth"
                                value={measurements.foreheadWidth}
                                onChange={handleChange}
                                className="w-full bg-black border border-antigravity-border rounded-lg px-4 py-3 text-white focus:border-electric-blue focus:outline-none transition-colors"
                                placeholder="0.0"
                                step="0.1"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-electric-blue text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Analysis
                    </button>
                </form>
            </div>
        </div>
    );
}
