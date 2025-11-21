// Local type definition
type NormalizedLandmark = {
    x: number;
    y: number;
    z: number;
};

import { calculateDistance } from './geometry';

const LANDMARKS = {
    TOP_HEAD: 10,
    CHIN: 152,
    LEFT_CHEEK: 234,
    RIGHT_CHEEK: 454,
    LEFT_EYE_OUTER: 33,
    RIGHT_EYE_OUTER: 263,
    NOSE_LEFT: 129, // Alar base
    NOSE_RIGHT: 358,
    MOUTH_LEFT: 61,
    MOUTH_RIGHT: 291,
};

const PHI = 1.61803398875;

export interface GoldenRatioResult {
    score: number; // 0-100
    ratios: {
        faceRatio: number; // Length / Width
        noseEyeRatio: number; // Eye Dist / Nose Width
        lipsNoseRatio: number; // Lips Width / Nose Width
    };
}

export const calculateGoldenRatio = (landmarks: NormalizedLandmark[]): GoldenRatioResult => {
    if (!landmarks || landmarks.length < 468) {
        return { score: 0, ratios: { faceRatio: 0, noseEyeRatio: 0, lipsNoseRatio: 0 } };
    }

    // 1. Calculate Distances
    const faceLength = calculateDistance(landmarks[LANDMARKS.TOP_HEAD], landmarks[LANDMARKS.CHIN]);
    const faceWidth = calculateDistance(landmarks[LANDMARKS.LEFT_CHEEK], landmarks[LANDMARKS.RIGHT_CHEEK]);

    const eyeDistance = calculateDistance(landmarks[LANDMARKS.LEFT_EYE_OUTER], landmarks[LANDMARKS.RIGHT_EYE_OUTER]);
    const noseWidth = calculateDistance(landmarks[LANDMARKS.NOSE_LEFT], landmarks[LANDMARKS.NOSE_RIGHT]);

    const lipsWidth = calculateDistance(landmarks[LANDMARKS.MOUTH_LEFT], landmarks[LANDMARKS.MOUTH_RIGHT]);

    // 2. Calculate Ratios
    const faceRatio = faceLength / faceWidth;
    const noseEyeRatio = eyeDistance / noseWidth;
    const lipsNoseRatio = lipsWidth / noseWidth;

    // 3. Calculate Deviation from Phi
    // We want to minimize deviation. 0 deviation = 100 score.

    const calculateScoreComponent = (val: number, target: number) => {
        const deviation = Math.abs(val - target);
        const percentError = deviation / target;
        // Score drops as error increases. 
        // If error is 0, score 100. If error is 50%, score 50.
        return Math.max(0, 100 * (1 - percentError));
    };

    const score1 = calculateScoreComponent(faceRatio, PHI); // Ideal: 1.618
    // Note: Nose/Eye and Lips/Nose ratios vary, but Phi is often cited.
    // Actually, Eye Dist / Nose Width is often close to Phi? Or Nose Width * Phi = Eye Dist?
    // Let's assume Phi is the target for these specific aesthetic ratios for this app's logic.
    // Usually: Mouth Width = 1.618 * Nose Width.
    const score2 = calculateScoreComponent(lipsNoseRatio, PHI);

    // Eye Distance vs Nose Width? 
    // Often: Interocular distance = Nose width. 
    // But Outer Eye Distance / Nose Width? 
    // Let's use a simpler metric: Face Ratio is the primary one.
    // Let's weight them.

    const totalScore = (score1 * 0.6) + (score2 * 0.4);

    return {
        score: Math.round(totalScore),
        ratios: {
            faceRatio,
            noseEyeRatio,
            lipsNoseRatio
        }
    };
};
