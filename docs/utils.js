function rgbToHsl(r, g, b) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function hslToString(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function diffToEpoch() {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const epoch = new Date("2024-06-06T00:00:00");
  const now = Date.now();

  return Math.floor((now - epoch) / _MS_PER_DAY);
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

var upArrow = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new 0 0 32 32" height="20px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="currentColor"/></svg>`;
var downArrow = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new 0 0 32 32" height="20px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="rotate(180, 16, 16)"><path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="currentColor"/></g></svg>`;

function addColorHint(hsl, targetHsl) {
  var chosenColor = Object.values(hsl);
  const [resultDivs, distance] = compareHSVColors(targetHsl, chosenColor);

  newHint = hintText.cloneNode()
  newHint.id = `hint${numberOfGuess}Text`
  newHint.style.background = hslToString(hsl);
  newHint.style.color = `hsl(${hsl.h}, ${(hsl.s + 50) % 100}%, ${(hsl.l + 50) % 100}%)`
  newHint.innerHTML = `&emsp;${numberOfGuess} | 3 &emsp; Distance to Color: ${distance}`
  newHint.classList.remove("hidden")
  resultDivs.append(newHint);
  resultDivs.id = `hint${numberOfGuess}`
  return [resultDivs, distance];
}

function compareHSVColors(target, selected) {
  const [h1, s1, v1] = target;
  const [h2, s2, v2] = selected;

  // Define thresholds for textual descriptions
  const hueDifference = (h1 - h2) / 3.6;
  const saturationDifference = s1 - s2;
  const valueDifference = v1 - v2;
  const differences = [hueDifference, saturationDifference, valueDifference];

  const totalDiff = [
    hueDifference,
    saturationDifference,
    valueDifference,
  ].reduce((partialSum, a) => partialSum + Math.abs(a), 0);

  // Helper function for differences
  const describeDifference = (difference) => {
    var arrow = "●";
    if (difference > 0.5) {
      arrow = upArrow;
    } else if (difference < -0.5) {
      arrow = downArrow;
    }
    var guessType = "bg-green-500"; // perfect guess
    if (Math.abs(difference) > 20) {
      guessType = "bg-red-800";  // far guess
    } else if (Math.abs(difference) > 2.5) {
      guessType = "bg-orange-400";  // close guess
    }
    return `<div class="w-7 min-w-7 border ${guessType} rounded flex justify-center items-center">${arrow}</div>`;
  };

  // Create a new resultRow div
  const resultRow = document.createElement("div");
  resultRow.className = "flex min-h-7 gap-3";

  // Append each hint div to the resultRow
  differences.forEach((diff) => {
    const hintHTML = describeDifference(diff);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = hintHTML;

    // Append the hint div to the resultRow
    resultRow.appendChild(tempDiv.firstChild);
  });

  return [resultRow, Math.round(totalDiff)];
}
