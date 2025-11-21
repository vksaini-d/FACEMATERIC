// Local type definition
type NormalizedLandmark = {
    x: number;
    y: number;
    z: number;
};

import { calculateDistance } from './geometry';

// Landmark Indices
const LANDMARKS = {
    TOP_HEAD: 10,
    CHIN: 152,
    LEFT_CHEEK: 234,
    RIGHT_CHEEK: 454,
    LEFT_JAW: 58,  // Approx jaw corner
    RIGHT_JAW: 288, // Approx jaw corner
    LEFT_FOREHEAD: 103,
    RIGHT_FOREHEAD: 332,
};

export type FaceShape = 'OVAL' | 'ROUND' | 'SQUARE' | 'DIAMOND' | 'HEART' | 'OBLONG' | 'UNKNOWN';

export const calculateFaceShapeFromDimensions = (
    faceLength: number,
    cheekWidth: number,
    jawWidth: number,
    foreheadWidth: number
): FaceShape => {
    // Analyze Ratios & Comparisons
    const lengthToWidthRatio = faceLength / cheekWidth;

    // Thresholds (approximate, can be tuned)
    const isLong = lengthToWidthRatio > 1.45;
    const isWide = lengthToWidthRatio < 1.15;
    const isJawProminent = jawWidth >= cheekWidth * 0.9;
    const isForeheadProminent = foreheadWidth >= cheekWidth * 0.9;
    const isChinPointy = jawWidth < cheekWidth * 0.75; // Simplification

    // Determine Shape
    if (isLong) {
        return 'OBLONG';
    }

    if (isWide) {
        if (isJawProminent) return 'SQUARE';
        return 'ROUND';
    }

    // Diamond: Cheekbones widest, narrow forehead and chin
    if (cheekWidth > foreheadWidth && cheekWidth > jawWidth && isChinPointy) {
        return 'DIAMOND';
    }

    // Heart: Wide forehead, narrow chin
    if (foreheadWidth > jawWidth && isChinPointy) {
        return 'HEART';
    }

    // Square: Jaw width similar to cheek width, angular
    if (isJawProminent) {
        return 'SQUARE';
    }

    // Default to Oval (balanced)
    return 'OVAL';
};

export const calculateFaceShape = (landmarks: NormalizedLandmark[]): FaceShape => {
    if (!landmarks || landmarks.length < 468) return 'UNKNOWN';

    // Calculate Dimensions
    const faceLength = calculateDistance(landmarks[LANDMARKS.TOP_HEAD], landmarks[LANDMARKS.CHIN]);
    const cheekWidth = calculateDistance(landmarks[LANDMARKS.LEFT_CHEEK], landmarks[LANDMARKS.RIGHT_CHEEK]);
    const jawWidth = calculateDistance(landmarks[LANDMARKS.LEFT_JAW], landmarks[LANDMARKS.RIGHT_JAW]);
    const foreheadWidth = calculateDistance(landmarks[LANDMARKS.LEFT_FOREHEAD], landmarks[LANDMARKS.RIGHT_FOREHEAD]);

    return calculateFaceShapeFromDimensions(faceLength, cheekWidth, jawWidth, foreheadWidth);
};
