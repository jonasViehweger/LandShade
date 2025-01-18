function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, v];
}

function compareHSVColors(hsv1, hsv2) {
    const [h1, s1, v1] = hsv1;
    const [h2, s2, v2] = hsv2;

    // Define thresholds for textual descriptions
    const hueDifference = Math.abs(h1 - h2);
    const saturationDifference = Math.abs(s1 - s2);
    const valueDifference = Math.abs(v1 - v2);

    // Helper function for differences
    const describeDifference = (difference, type) => {
        if (difference < 10) return `a little ${type}`;
        if (difference < 30) return `somewhat ${type}`;
        if (difference < 60) return `a lot ${type}`;
        return `much ${type}`;
    };

    // Describe hue
    let hueDescription = "";
    if (hueDifference > 0) {
        const closerToRed = (h1 - h2 + 360) % 360 <= 180 ? "closer towards red" : "further from red";
        hueDescription = `The target color is ${describeDifference(hueDifference, closerToRed)}.`;
    }

    // Describe saturation
    let saturationDescription = "";
    if (saturationDifference > 0) {
        const moreOrLessSaturated = s1 > s2 ? "less saturated" : "more saturated";
        saturationDescription = `It is ${describeDifference(saturationDifference, moreOrLessSaturated)}.`;
    }

    // Describe value (brightness)
    let valueDescription = "";
    if (valueDifference > 0) {
        const lighterOrDarker = v1 > v2 ? "lighter" : "darker";
        valueDescription = `It is ${describeDifference(valueDifference, lighterOrDarker)}.`;
    }

    // Combine descriptions
    return [hueDescription, saturationDescription, valueDescription]
        .filter(desc => desc) // Remove empty descriptions
        .join(" ");
}


