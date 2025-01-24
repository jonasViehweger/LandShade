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

    return [h*360, s*100, v*100];
}


function compareHSVColors(target, selected) {
    const [h1, s1, v1] = target;
    const [h2, s2, v2] = selected;

    // Define thresholds for textual descriptions
    const hueDifference = (h1 - h2)/3.6
    const saturationDifference = s1 - s2;
    const valueDifference = v1 - v2;
    const differences = [hueDifference,saturationDifference,valueDifference]

    const totalDiff = [hueDifference, saturationDifference, valueDifference].reduce((partialSum, a) => partialSum + Math.abs(a), 0);

    // Helper function for differences
    const describeDifference = (difference) => {
        var arrow = "●";
        if (difference > 2.5 ) {
            arrow = "⮝"
        } else if (difference < -2.5 ){
            arrow = "⮟"
        }
        var guessType = "perfect"
        if (Math.abs(difference) > 20) {
            guessType = "far";
        } else if (Math.abs(difference) > 2.5){
            guessType = "close";
        }
        return `<div class="hint" id=${guessType}>${arrow}</div>`;
    };

    // Create a new resultRow div
    const resultRow = document.createElement("div");
    resultRow.className = "resultRow";

    // Append each hint div to the resultRow
    differences.forEach((diff) => {
        const hintHTML = describeDifference(diff);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = hintHTML;

        // Append the hint div to the resultRow
        resultRow.appendChild(tempDiv.firstChild);
    });

    return [resultRow, Math.round(totalDiff)]
}