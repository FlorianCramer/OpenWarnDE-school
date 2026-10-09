export type NormalizedWeatherPixel = {
    precipitationRate: number;
    isWet: boolean;
};

export function normalizeWeatherPixel(
    r: number,
    g: number,
    b: number,
    alpha: number,
): NormalizedWeatherPixel {
    if (alpha === 0) return { precipitationRate: 0, isWet: false };

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 180 && max - min < 35) {
        return { precipitationRate: 0, isWet: false };
    }

    let precipitationRate = 0;
    if (r > 210 && g < 120) precipitationRate = 120;
    else if (r > 180 && g > 90 && g < 210 && b < 100) precipitationRate = 30;
    else if (r > 180 && g > 170 && b < 110) precipitationRate = 12;
    else if (b > r * 1.25 && b > g * 1.05) precipitationRate = g > 100 ? 2 : 0.5;
    else if (g > r * 1.15 && g > b * 1.05) precipitationRate = 5;
    else if (b > r && b > g) precipitationRate = 1;

    return {
        precipitationRate,
        isWet: precipitationRate > 0,
    };
}
