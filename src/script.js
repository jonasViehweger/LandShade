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

// Event listener for color changes
colorPicker.on(["color:init", "color:change"], function (color) {
  selectedColorDiv.style.backgroundColor = color.hexString;
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

function finishGame(){
  document.getElementById("checkColorButton").disabled = true;
  document.body.style.background = `rgb(${currentCountry.red}, ${currentCountry.green}, ${currentCountry.blue})`;
}

// Button click event to check distance
document.getElementById("checkColorButton").addEventListener("click", function () {
  var chosenColor = Object.values(colorPicker.color.hsl);
  var resultDivs = compareHSVColors(targetColor, chosenColor);

  resultDiv.prepend(resultDivs);
  numberOfGuess++
  if(numberOfGuess>totalAllowedGuesses){
    finishGame()
  }
});

