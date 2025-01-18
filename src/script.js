var colorPicker = new iro.ColorPicker("#ColorPicker", {
  width: 300,
  color: "rgb(255, 0, 0)",
  borderWidth: 1,
  borderColor: "#fff",
  layout: [
    { component: iro.ui.Wheel },
    { component: iro.ui.Slider, options: { sliderType: 'hue' } },
    { component: iro.ui.Slider, options: { sliderType: 'saturation' } },
    { component: iro.ui.Slider, options: { sliderType: 'value' } },
  ],
});

var selectedColorDiv = document.getElementById("SelectedColor");
var resultParagraph = document.getElementById("result");



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

// Button click event to check distance
document.getElementById("checkColorButton").addEventListener("click", function () {
  var chosenColor = Object.values(colorPicker.color.hsl);
  console.log(chosenColor)
  var evaluationString = compareHSVColors(targetColor, chosenColor);
  resultParagraph.textContent = evaluationString;
});
