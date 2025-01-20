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
    console.log(target)
    console.log(selected)

    // Define thresholds for textual descriptions
    const hueDifference = (h1 - h2)/3.6
    const saturationDifference = s1 - s2;
    const valueDifference = v1 - v2;
    const differences = [hueDifference,saturationDifference,valueDifference]

    // Helper function for differences
    const describeDifference = (difference) => {
        var arrow = "●";
        if (difference > 5 ) {
            arrow = "⮝"
        } else if (difference < -5 ){
            arrow = "⮟"
        }
        var guessType = "perfect"
        if (Math.abs(difference) > 5) {
            guessType = "close";
        } else if (Math.abs(difference) > 20){
            guessType = "far";
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

    
    return resultRow
}

// function compareHSVColors(hsv1, hsv2) {
//     const [h1, s1, v1] = hsv1;
//     const [h2, s2, v2] = hsv2;
//     console.log(hsv1)
//     console.log(hsv2)

//     // Define thresholds for textual descriptions
//     const hueDifference = ((Math.abs(h1 - h2) + 360) % 360)/1.8
//     const saturationDifference = Math.abs(s1 - s2);
//     const valueDifference = Math.abs(v1 - v2);

//     // Helper function for differences
//     const describeDifference = (difference, type) => {
//         if (difference < 10) return `a little ${type}`;
//         if (difference < 30) return `somewhat ${type}`;
//         if (difference < 60) return `a lot ${type}`;
//         return `much ${type}`;
//     };

//     // Describe hue
//     let hueDescription = "";
//     if (hueDifference > 0) {
//         hueDescription = `The target hue is ${describeDifference(hueDifference, "different")}.`;
//     }

//     // Describe saturation
//     let saturationDescription = "";
//     if (saturationDifference > 0) {
//         const moreOrLessSaturated = s1 > s2 ? "more saturated" : "less saturated";
//         saturationDescription = `It is ${describeDifference(saturationDifference, moreOrLessSaturated)}.`;
//     }

//     // Describe value (brightness)
//     let valueDescription = "";
//     if (valueDifference > 0) {
//         const lighterOrDarker = v1 > v2 ? "brighter" : "darker";
//         valueDescription = `It is ${describeDifference(valueDifference, lighterOrDarker)}.`;
//     }

//     // Combine descriptions
//     return [hueDescription, saturationDescription, valueDescription]
//         .filter(desc => desc) // Remove empty descriptions
//         .join(" ");
// }


