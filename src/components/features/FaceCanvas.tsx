'use client';

import React, { useRef, useEffect } from 'react';
import { Results } from '@/hooks/useFaceDetection';

interface FaceCanvasProps {
  results: Results | null;
  width?: number;
  height?: number;
  className?: string;
  mirror?: boolean;
}

// FACEMESH_TESSELATION connections (subset for performance)
const FACE_CONNECTIONS = [
  [127, 34], [34, 139], [139, 127], [11, 0], [0, 37], [37, 11],
  [232, 231], [231, 120], [120, 232], [72, 37], [37, 0], [0, 72],
  [128, 121], [121, 47], [47, 128], [232, 121], [121, 128], [128, 232],
  [104, 69], [69, 108], [108, 104], [151, 9], [9, 8], [8, 151],
  [338, 337], [337, 336], [336, 338], [151, 108], [108, 69], [69, 151]
];

export default function FaceCanvas({ results, width = 1280, height = 720, className, mirror = false }: FaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !results || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas dimensions match props
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    
    if (mirror) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
    }
    
    // Draw face mesh
    for (const landmarks of results.multiFaceLandmarks) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 0.5;
      
      // Draw all landmark points
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];
        if (landmark) {
          const x = landmark.x * width;
          const y = landmark.y * height;
          
          // Draw connections for key face structure points
          if (i < FACE_CONNECTIONS.length) {
            const [startIdx, endIdx] = FACE_CONNECTIONS[i % FACE_CONNECTIONS.length];
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];
            
            if (start && end) {
              ctx.beginPath();
              ctx.moveTo(start.x * width, start.y * height);
              ctx.lineTo(end.x * width, end.y * height);
              ctx.stroke();
            }
          }
          
          // Draw point
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }, [results, width, height, mirror]);

  return (
    <canvas 
        ref={canvasRef}
        className={className || "absolute inset-0 w-full h-full pointer-events-none"}
        width={width}
        height={height}
    />
  );
}
