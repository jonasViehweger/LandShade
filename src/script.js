var colorPicker = new iro.ColorPicker("#ColorPicker", {
  height: 300,
  color: "rgb(255, 255, 255)",
  borderWidth: 1,
  borderColor: "#fff",
  layoutDirection: 'horizontal',
  layout: [
    { component: iro.ui.Wheel },
    { component: iro.ui.Slider, options: { sliderType: 'hue' } },
    { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
    { component: iro.ui.Slider, options: { sliderType: 'value' } },
  ],
});

var selectedColorDiv = document.getElementById("SelectedColor");
var resultDiv = document.getElementById("result");

var contrastColor = "";
// Event listener for color changes
colorPicker.on(["color:init", "color:change"], function (color) {
  const c = color.hsl;
  selectedColorDiv.style.backgroundColor = color.hexString;
  contrastColor = `hsl(${c.h}, ${(c.s+50)%100}%, ${(c.l+50)%100}%)`;
  selectedColorDiv.style.color = contrastColor;
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var currentCountry = colors[getRandomInt(colors.length)]

var months = [
  "Nothing",
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

var promptParagraph = document.getElementById("promptParagraph")
promptParagraph.textContent = `
  Which Color do the ${currentCountry.landCover} of 
  ${currentCountry.shapeName} have in ${months[currentCountry.month]}?`

// Target color for comparison
var targetColor = rgbToHsv(currentCountry.red,currentCountry.green,currentCountry.blue);

var numberOfGuess = 1;
var totalAllowedGuesses = 3;

function finishGame(distance){
  //document.getElementById("checkColorButton").disabled = true;
  document.body.style.background = `rgb(${currentCountry.red}, ${currentCountry.green}, ${currentCountry.blue})`;
  var resultText = document.getElementById("resultContent");
  resultText.textContent = `Your final distance was ${distance}`
  window.location.href = '#resultOverlay';
  selectedColorDiv.style.pointerEvents = "none";
  selectedColorDiv.textContent = "";
}

// Button click event to check distance
selectedColorDiv.addEventListener("click", function () {
  var hsl = colorPicker.color.hsl;
  var chosenColor = Object.values(hsl);
  const [resultDivs, distance] = compareHSVColors(targetColor, chosenColor);

  const nGuess = document.createElement("div");
  nGuess.innerHTML = `<div class="hint" style="background: ${colorPicker.color.hexString}; color: hsl(${hsl.h}, ${(hsl.s+50)%100}%, ${(hsl.l+50)%100}%); width: 295px;">${numberOfGuess} | 3 &emsp; Distance to Color: ${distance}</div>`;
  resultDivs.append(nGuess.firstChild);

  resultDiv.append(resultDivs);
  numberOfGuess++
  if(numberOfGuess>totalAllowedGuesses){
    console.log(chosenColor)
    console.log(targetColor)
    finishGame(distance)
  }
});

