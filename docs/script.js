var colorPicker = new iro.ColorPicker("#ColorPicker", {
  width: 348,
  color: "rgb(255, 255, 255)",
  borderWidth: 1,
  borderColor: "#fff",
  layoutDirection: "horizontal",
  layout: [
    { component: iro.ui.Wheel },
    { component: iro.ui.Slider, options: { sliderType: "hue" } },
    { component: iro.ui.Slider, options: { sliderType: "saturation" } },
    { component: iro.ui.Slider, options: { sliderType: "value" } },
  ],
});

colorPicker.on(["mount"], function () {
  var colorWheel = document.getElementsByClassName("IroWheel")[0]
  colorWheel.style.display = ""
  colorWheel.classList.add("hidden")
  colorWheel.classList.add("sm:inline-block")
});


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function openPopup(div) {
  const popupId = div.getAttribute("data-popup");
  document.getElementById(popupId).classList.remove("hidden");
}

// Close pop-up when clicking the close button
document.querySelectorAll(".close-popup").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    this.closest(".popup").classList.add("hidden");
  });
});

// Close pop-up when clicking outside the modal
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", function (event) {
    if (event.target === this) {
      this.classList.add("hidden");
    }
  });
});

let selectedColorDiv = document.getElementById("SelectedColor");
let resultDiv = document.getElementById("result");
let finalResult = document.getElementById("finalResult");
let hintText = document.getElementById("hintText");

// Select color: It's randomly sorted and we just go through one by one, by using the date as index
var diffToEpoch = diffToEpoch();
var currentCountry = colors[diffToEpoch % colors.length];

// Target color for comparison
var targetColor = rgbToHsl(
  currentCountry.red,
  currentCountry.green,
  currentCountry.blue,
);
var targetColorHSL = `hsl(${targetColor[0]}, ${targetColor[1]}%, ${targetColor[2]}%)`;
var targetColorHex = rgbToHex(
  currentCountry.red,
  currentCountry.green,
  currentCountry.blue,
);
var numberOfGuess = 1;
var totalAllowedGuesses = 3;
var shortestDistance = Infinity;
var bestColor = "None"

function finishGame(distance, finalColorHsl) {
  var finalDistance = document.getElementById("finalDistance");
  finalDistance.textContent = `Your final distance to the target color was: ${distance}`;
  var swatch = document.getElementById("swatch");
  swatch.style.background = `linear-gradient(90deg, ${hslToString(finalColorHsl)} 50%, ${targetColorHSL} 50%)`;

  const [r, g, b] = hslToRgb(
    finalColorHsl.h / 360,
    finalColorHsl.s / 100,
    finalColorHsl.l / 100,
  );
  const rgbHex = rgbToHex(Math.round(r), Math.round(g), Math.round(b));

  var colorInfoTarget = document.getElementById("targetColor");
  colorInfoTarget.innerHTML = `
    <h3>Target Color</h3>
  <p>${targetColorHSL}</p>
  <p>${targetColorHex}</p>
  `;

  var colorInfoUser = document.getElementById("yourColor");
  colorInfoUser.innerHTML = `
    <h3>Your Color</h3>
  <p>${hslToString(finalColorHsl)}</p>
  <p>${rgbHex}</p>
  `;

  selectedColorDiv.style.pointerEvents = "none";
  selectedColorDiv.textContent = "";
  finalResult.style.background = targetColorHSL;
  finalResult.style.color = `hsl(${targetColor[0]}, ${(targetColor[1] + 50) % 100}%, ${(targetColor[2] + 50) % 100}%)`
  finalResult.innerHTML = `Your shortest distance was ${distance} away.</br>Click for results.`
  finalResult.parentNode.appendChild(finalResult);
  finalResult.classList.remove("hidden");
  finalResult.scrollIntoView({ behavior: "smooth", block: "end" });
}

if (storageAvailable("localStorage")) {
  var lastPlayed = localStorage.getItem("lastPlayed") || -1;
  // If played for the first time: Start tour
  if (lastPlayed != diffToEpoch) {
    localStorage.setItem("lastPlayed", diffToEpoch);
    localStorage.setItem("gameState", JSON.stringify([]));
  }
  var gameState = JSON.parse(localStorage.getItem("gameState") || "[]");
  for (const hsl of gameState) {
    const [resultDivs, distance] = addColorHint(hsl, targetColor);
    if (distance < shortestDistance){
      shortestDistance = distance;
      bestColor = hsl;
    }
    resultDiv.append(resultDivs);
    newHint.scrollIntoView({ behavior: "smooth", block: "end" });

    colorPicker.colors[0].hsl = hsl;
    numberOfGuess++;
  }
  if (numberOfGuess > totalAllowedGuesses) {
    finishGame(shortestDistance, bestColor);
  }
  if (localStorage.getItem("tourTaken") != "true"){
    startTour()
  }
}

var contrastColor = "";
// Event listener for color changes
colorPicker.on(["color:init", "color:change"], function (color) {
  const c = color.hsl;
  selectedColorDiv.style.backgroundColor = color.hexString;
  contrastColor = `hsl(${c.h}, ${(c.s + 50) % 100}%, ${(c.l + 50) % 100}%)`;
  selectedColorDiv.style.color = contrastColor;
});

var months = [
  "Nothing",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var promptParagraph = document.getElementById("promptParagraph");
promptParagraph.textContent = `
  Which Color do the ${currentCountry.landCover} of 
  ${currentCountry.shapeName} have in ${months[currentCountry.month]}?`;

function updateRecord(div) {
  colorPicker.colors[0].rgbString = div.style.background;
}

// Button click event to check distance
selectedColorDiv.addEventListener("click", function () {
  var hsl = colorPicker.color.hsl;
  gameState.push(hsl);
  localStorage.setItem("gameState", JSON.stringify(gameState));
  const [resultDivs, distance] = addColorHint(hsl, targetColor);
  if (distance < shortestDistance){
    shortestDistance = distance;
    bestColor = hsl;
  }
  resultDiv.append(resultDivs);
  newHint.scrollIntoView({ behavior: "smooth", block: "end" });

  numberOfGuess++;
  if (numberOfGuess > totalAllowedGuesses) {
    finishGame(shortestDistance, bestColor);
    window.location.href = "#resultOverlay";
  }
});
