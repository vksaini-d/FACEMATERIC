"use client";

import { useState, useMemo, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import CameraFeed from "@/components/features/CameraFeed";
import UploadZone from "@/components/features/UploadZone";
import ManualInput from "@/components/features/ManualInput";
import AnalysisPanel, { AnalysisData } from "@/components/features/AnalysisPanel";
import HistoryPanel from "@/components/features/HistoryPanel";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useHistory } from "@/hooks/useHistory";
import { calculateFaceShape, FaceShape } from "@/lib/analysis/faceShape";
import { calculateGoldenRatio } from "@/lib/analysis/goldenRatio";
import { Camera, Upload as UploadIcon, Ruler, History as HistoryIcon } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { AppMode } from "@/components/layout/Sidebar";

export default function Home() {
  const { user } = useAuth();
  const { results, isLoading, onVideoReady, detectImage, isInitialized } = useFaceDetection();
  const { history, addToHistory, clearHistory } = useHistory(user?.uid);

  const [mode, setMode] = useState<AppMode>('camera');
  const [manualData, setManualData] = useState<AnalysisData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-calculate from MediaPipe results
  const autoData = useMemo<AnalysisData | null>(() => {
    if (!results || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      return null;
    }
    const landmarks = results.multiFaceLandmarks[0];
    return {
      shape: calculateFaceShape(landmarks),
      ratio: calculateGoldenRatio(landmarks),
    };
  }, [results]);

  // Determine which data to show
  const displayData = mode === 'manual' ? manualData : autoData;

  const handleManualCalculate = (shape: FaceShape, ratioScore: number) => {
    setManualData({
      shape,
      ratio: {
        score: ratioScore,
        ratios: { faceRatio: 0, noseEyeRatio: 0, lipsNoseRatio: 0 } // Mock details for manual
      }
    });
  };

  const handleSave = () => {
    if (displayData) {
      addToHistory({
        shape: displayData.shape,
        score: displayData.ratio.score,
        ratios: displayData.ratio.ratios,
        type: mode === 'manual' ? 'manual' : (mode === 'upload' ? 'upload' : 'camera')
      });
      // Optional: Show toast or feedback
    }
  };

  if (!isMounted) return null;

  return (
    <AppLayout currentMode={mode} onModeChange={setMode}>
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Center: Canvas/Camera/History */}
        <div className="lg:col-span-2 relative border-r border-antigravity-border bg-black flex flex-col overflow-hidden">

          {/* Mode Switcher (Visible only in capture modes) */}
          {(mode === 'camera' || mode === 'upload' || mode === 'manual') && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex bg-antigravity-black/80 backdrop-blur-md rounded-full p-1 border border-antigravity-border">
              <button
                onClick={() => setMode('camera')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  mode === 'camera' ? "bg-electric-blue text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <Camera className="w-4 h-4" />
                Camera
              </button>
              <button
                onClick={() => setMode('upload')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  mode === 'upload' ? "bg-electric-blue text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <UploadIcon className="w-4 h-4" />
                Upload
              </button>
              <button
                onClick={() => setMode('manual')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  mode === 'manual' ? "bg-electric-blue text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <Ruler className="w-4 h-4" />
                Manual
              </button>
            </div>
          )}

          <div className="flex-1 relative flex items-center justify-center w-full h-full">
            {mode === 'camera' && (
              <CameraFeed
                onVideoReady={onVideoReady}
                results={results}
                isLoading={isLoading}
              />
            )}
            {mode === 'upload' && (
              <UploadZone
                detectImage={detectImage}
                results={results}
                isLoading={isLoading}
                isInitialized={isInitialized}
              />
            )}
            {mode === 'manual' && (
              <ManualInput onCalculate={handleManualCalculate} />
            )}
            {mode === 'history' && (
              <div className="w-full h-full">
                <HistoryPanel history={history} onClear={clearHistory} isAuthenticated={!!user} />
              </div>
            )}
            {mode === 'settings' && (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <SettingsIcon className="w-12 h-12 mb-4 opacity-50" />
                <p>Settings coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Analysis Panel */}
        <AnalysisPanel data={displayData} onSave={handleSave} />
      </div>
    </AppLayout>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

