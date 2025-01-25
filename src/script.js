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
var targetColor = rgbToHsl(currentCountry.red,currentCountry.green,currentCountry.blue);
var targetColorHSL = `hsl(${targetColor[0]}, ${targetColor[1]}%, ${targetColor[2]}%)`
var targetColorHex = rgbToHex(currentCountry.red,currentCountry.green,currentCountry.blue);

var numberOfGuess = 1;
var totalAllowedGuesses = 3;


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function finishGame(distance){
  var finalDistance = document.getElementById("finalDistance");
  finalDistance.textContent = `Your final distance to the target color was: ${distance}`
  var swatch = document.getElementsByClassName("swatch")[0];
  swatch.style.background = `linear-gradient(90deg, ${finalColor.hslString} 50%, ${targetColorHSL} 50%)`

  var colorInfoTarget = document.getElementsByClassName("colorInfo")[1];
  colorInfoTarget.innerHTML = `
    <h3>Target Color</h3>
  <p>${targetColorHSL}</p>
  <p>${targetColorHex}</p>
  `

  var colorInfoUser = document.getElementsByClassName("colorInfo")[0];
  colorInfoUser.innerHTML = `
    <h3>User Color</h3>
  <p>${finalColor.hslString}</p>
  <p>${finalColor.hexString}</p>
  `

  selectedColorDiv.style.pointerEvents = "none";
  selectedColorDiv.textContent = "";
  const finalGuess = document.createElement("div");
  finalGuess.innerHTML = `<a class="hint resultRow finalButton" id="text" style="background: ${targetColorHSL}; color: hsl(${targetColor[0]}, ${(targetColor[1]+50)%100}%, ${(targetColor[2]+50)%100}%); width: 416px; height: 70px;" onClick="gotoResults()">Your final distance was ${distance} away.<br/>
  Click to see results. </a>`;
  resultDiv.append(finalGuess.firstChild);
  window.location.href = '#resultOverlay';
}

function updateRecord(div) {
  colorPicker.colors[0].rgbString = div.style.background;
}

function gotoResults(){
  window.location.href = '#resultOverlay';
}

var finalColor;
// Button click event to check distance
selectedColorDiv.addEventListener("click", function () {
  var hsl = colorPicker.color.hsl;
  var chosenColor = Object.values(hsl);
  const [resultDivs, distance] = compareHSVColors(targetColor, chosenColor);

  const nGuess = document.createElement("div");
  nGuess.innerHTML = `<div onclick="updateRecord(this)" class="hint" id="text" style="background: ${colorPicker.color.hexString}; color: hsl(${hsl.h}, ${(hsl.s+50)%100}%, ${(hsl.l+50)%100}%); width: 295px; text-align: left;">&emsp;${numberOfGuess} | 3 &emsp; Distance to Color: ${distance}</div>`;
  resultDivs.append(nGuess.firstChild);

  resultDiv.append(resultDivs);
  numberOfGuess++
  if(numberOfGuess>totalAllowedGuesses){
    finalColor = colorPicker.color;
    console.log(chosenColor)
    console.log(targetColor)
    finishGame(distance)
  }
});

