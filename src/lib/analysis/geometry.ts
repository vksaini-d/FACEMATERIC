// Local type definition
type NormalizedLandmark = {
    x: number;
    y: number;
    z: number;
};

export interface Point {
    x: number;
    y: number;
    z?: number;
}

export const calculateDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    // We ignore Z for 2D ratio calculations usually, but MediaPipe provides it.
    // For face shape (frontal view), 2D is often sufficient if the face is straight.
    return Math.sqrt(dx * dx + dy * dy);
};

export const calculateRatio = (n1: number, n2: number): number => {
    if (n2 === 0) return 0;
    return n1 / n2;
};
