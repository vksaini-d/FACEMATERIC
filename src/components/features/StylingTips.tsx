import React from 'react';
import { FaceShape } from '@/lib/analysis/faceShape';

interface StylingTipsProps {
    shape: FaceShape;
}

const STYLING_TIPS: Record<FaceShape, { hairstyle: string; glasses: string; makeup?: string }> = {
    OVAL: {
        hairstyle: "Lucky you! Oval faces suit almost any hairstyle. Try side-swept bangs, long layers, or a sleek bob. Avoid styles that add too much height on top.",
        glasses: "Most frame shapes work well. Try aviators, wayfarers, or oversized frames for a balanced look.",
        makeup: "Contour along the hairline and under cheekbones to add dimension. Apply blush on the apples of cheeks."
    },
    ROUND: {
        hairstyle: "Add height and length with layered cuts, side parts, or long waves. Avoid blunt bangs and chin-length bobs that emphasize roundness.",
        glasses: "Angular frames like rectangles or cat-eyes help add definition. Avoid round frames that mirror your face shape.",
        makeup: "Contour along temples and under cheekbones to create angles. Apply blush diagonally from cheeks to temples."
    },
    SQUARE: {
        hairstyle: "Soften angles with waves, curls, or side-swept styles. Long layers past the chin work great. Avoid blunt cuts at jaw level.",
        glasses: "Round or oval frames soften strong jawlines. Cat-eye frames also work well. Avoid square or geometric frames.",
        makeup: "Contour the corners of forehead and jawline to soften angles. Round out blush application on cheek apples."
    },
    DIAMOND: {
        hairstyle: "Add width at forehead and chin with side-swept bangs, chin-length bobs, or textured layers. Avoid extra volume at cheekbones.",
        glasses: "Cat-eye or oval frames that are wider than cheekbones. Rimless or light frames work beautifully.",
        makeup: "Highlight forehead and chin. Contour under cheekbones to reduce width. Soft blush on cheek apples."
    },
    HEART: {
        hairstyle: "Balance a wider forehead with chin-length bobs, side parts, or styles with volume at the bottom. Avoid top-heavy styles.",
        glasses: "Bottom-heavy frames like aviators or frames wider at the bottom. Avoid top-heavy cat-eyes.",
        makeup: "Contour temples and sides of forehead. Highlight chin. Apply blush on lower cheeks to add width."
    },
    OBLONG: {
        hairstyle: "Add width with waves, curls, or blunt bangs. Shoulder-length cuts with layers work well. Avoid long, straight styles that elongate.",
        glasses: "Oversized or decorative frames add width. Deep frames with bold temples work great. Avoid narrow frames.",
        makeup: "Contour along hairline and under chin to shorten face. Apply blush horizontally across cheeks."
    },
    UNKNOWN: {
        hairstyle: "Consult with a professional stylist for personalized recommendations based on your unique features.",
        glasses: "Try different frame styles to see what complements your features best.",
        makeup: "Experiment with different techniques to find what enhances your natural beauty."
    }
};

export default function StylingTips({ shape }: StylingTipsProps) {
    const tips = STYLING_TIPS[shape];

    return (
        <div className="space-y-3">
            <div>
                <p className="text-xs text-electric-blue uppercase font-mono mb-1.5">💇 Hairstyle</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{tips.hairstyle}</p>
            </div>

            <div>
                <p className="text-xs text-electric-blue uppercase font-mono mb-1.5">👓 Glasses</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{tips.glasses}</p>
            </div>

            {tips.makeup && (
                <div>
                    <p className="text-xs text-electric-blue uppercase font-mono mb-1.5">💄 Makeup</p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{tips.makeup}</p>
                </div>
            )}
        </div>
    );
}
