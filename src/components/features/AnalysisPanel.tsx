import React from 'react';
import clsx from 'clsx';
import { FaceShape } from '@/lib/analysis/faceShape';
import { GoldenRatioResult } from '@/lib/analysis/goldenRatio';
import { Save } from 'lucide-react';

export interface AnalysisData {
    shape: FaceShape;
    ratio: GoldenRatioResult;
}

interface AnalysisPanelProps {
    data: AnalysisData | null;
    onSave?: () => void;
}

export default function AnalysisPanel({ data, onSave }: AnalysisPanelProps) {
    const scoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 70) return 'text-electric-blue';
        return 'text-yellow-400';
    };

    return (
        <div className="bg-antigravity-gray p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-antigravity-border h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-5 sm:h-6 bg-electric-blue rounded-full"></span>
                    Analysis Results
                </h2>
                {data && onSave && (
                    <button
                        onClick={onSave}
                        className="p-2 rounded-full bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20 transition-colors"
                        title="Save to History"
                    >
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Shape Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-antigravity-black border border-antigravity-border group hover:border-electric-blue/50 transition-colors">
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Face Shape</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {data ? data.shape : '--'}
                    </h3>
                    {data && (
                        <p className="text-xs text-gray-400 mt-2">
                            Detected based on jawline and cheekbone structure.
                        </p>
                    )}
                </div>

                {/* Golden Ratio Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-antigravity-black border border-antigravity-border group hover:border-electric-blue/50 transition-colors">
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Symmetry Score</p>
                    <div className="flex items-end gap-2">
                        <h3 className={clsx("text-3xl sm:text-4xl font-bold tracking-tight", data ? scoreColor(data.ratio.score) : "text-gray-600")}>
                            {data ? data.ratio.score : '0.0'}
                        </h3>
                        <span className="text-sm text-gray-500 mb-1.5">/ 100</span>
                    </div>

                    {data && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-mono">
                                <span>Face Ratio (L/W)</span>
                                <span>{data.ratio.ratios.faceRatio.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-electric-blue h-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (data.ratio.ratios.faceRatio / 1.618) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                {data && (
                    <div className="p-4 sm:p-5 rounded-xl bg-antigravity-black border border-antigravity-border">
                        <p className="text-xs text-gray-500 uppercase font-mono mb-2">Styling Tips</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            For <strong>{data.shape}</strong> faces, consider hairstyles that add volume to the top to balance the proportions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
