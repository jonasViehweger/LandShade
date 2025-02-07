// Tour steps
const tourSteps = [
  {
    elementId: "title",
    message: "Welcome to LandShade, the game where you guess the colors of the Earth! Take the tour to learn how to play.",
  },
  {
    elementId: "promptParagraph",
    message: "Every day you will get a prompt for a land cover type, month and country. Your task is to guess the mean color of the land cover type as seen by satellites.",
  },
  {
    elementId: "colorInterface",
    message: "To guess the color you use these panels. The sliders you can see control different aspects of the color. From left to right they are hue, saturation and lightness. You use the panel all the way on the right to lock in your color.",
  },
  {
    elementId: "hint1",
    message: "Once you have guessed you will be shown how well you did. The squares with the arrows on the left show you how far you are away from the target color on each of the sliders. Red means you are very far away, yellow that you are close and green with a dot instead of an arrow, that you are spot on.",
  },
  {
    elementId: "hint1Text",
    message: "You are also shown how many guesses you have left and your score in terms of distance to the target color. Each of the sliders goes from 0-100, the score is the sum of how far you are away from the target color on each slider. If you ever want to go to a previous guess, you can also click on this area.",
  },
  {
    elementId: "faq",
    message: "Lastly, there's some general hints and background info available at the (?) in the top right if you're interested. Happy guessing!"
  }
];

let currentStep = 0;

// DOM Elements
const tourOverlay = document.getElementById("tourOverlay");
const tourText = document.getElementById("tourText");
const tourMessage = document.getElementById("tourMessage");
const nextButton = document.getElementById("nextButton");
const notInterestedButton = document.getElementById("notInterestedButton");

let hintNotAvailable = false;

// Start the tour
function startTour() {
  // close all pop-ups which might be open
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.add("hidden");
  });


  tourOverlay.classList.remove("hidden");
  tourText.classList.remove("hidden");
  updateButtonVisibility();
  showStep(currentStep);

  // set up hint if not already set up
  if(document.getElementById("hint1") === null){
    let [resultDivs, distance] = addColorHint({h:203, s:48, l:44}, [30, 48, 50]);
    resultDiv.append(resultDivs);
    hintNotAvailable = true;
  }
}

// Update button visibility and labels
function updateButtonVisibility() {
  if (currentStep === 0) {
    nextButton.textContent = "Take tour";
    notInterestedButton.style.display = "inline-block";
  } else {
    nextButton.textContent = currentStep === tourSteps.length - 1 ? "Finish" : "Next";
    notInterestedButton.style.display = "none";
  }
}

  // Add debounce function to optimize resize handling
function debounce(func, timeout = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function handleResize() {
  // Only update if tour is active
  if (!tourOverlay.classList.contains('hidden')) {
    showStep(currentStep);
  }
}

function showStep(stepIndex) {
  const step = tourSteps[stepIndex];
  const element = document.getElementById(step.elementId);

  // Smooth scroll to ensure element is visible
  element.scrollIntoView({
    behavior: 'instant',
    block: 'center',
    inline: 'center'
  });
  const rect = element.getBoundingClientRect();

  // Update overlay clip path
  tourOverlay.style.clipPath = `
    polygon(
      0% 0%, 
      0% 100%, 
      ${rect.left}px 100%, 
      ${rect.left}px ${rect.top}px, 
      ${rect.right}px ${rect.top}px, 
      ${rect.right}px ${rect.bottom}px, 
      ${rect.left}px ${rect.bottom}px, 
      ${rect.left}px 100%, 
      100% 100%, 
      100% 0%
    )
  `;

  // Set message before calculating position
  tourMessage.textContent = step.message;

  // Calculate available space
  const textHeight = tourText.offsetHeight;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom - 20; // 20px buffer
  const spaceAbove = rect.top - 20;

  // Determine best position
  let topPosition;
  if (spaceBelow > textHeight || spaceBelow > spaceAbove) {
    // Position below element
    topPosition = rect.bottom + window.scrollY + 10;
  } else {
    // Position above element
    topPosition = rect.top + window.scrollY - textHeight - 10;
  }

  // Apply positions
  tourText.style.top = `${topPosition}px`;
}

function updateOverlay(stepIndex){
  const step = tourSteps[stepIndex];
  const element = document.getElementById(step.elementId);
  const rect = element.getBoundingClientRect();

  // Update overlay clip path
  tourOverlay.style.clipPath = `
    polygon(
      0% 0%, 
      0% 100%, 
      ${rect.left}px 100%, 
      ${rect.left}px ${rect.top}px, 
      ${rect.right}px ${rect.top}px, 
      ${rect.right}px ${rect.bottom}px, 
      ${rect.left}px ${rect.bottom}px, 
      ${rect.left}px 100%, 
      100% 100%, 
      100% 0%
    )
  `;
}

// Add scroll listener
window.addEventListener('scroll', debounce(() => {
  if (!tourOverlay.classList.contains('hidden')) {
    updateOverlay(currentStep)
  }
}));

// Add resize listener
window.addEventListener('resize', debounce(handleResize));

// End tour function
function endTour() {
  tourOverlay.classList.add("hidden");
  tourText.classList.add("hidden");
  localStorage.setItem("tourTaken", true);
  if(hintNotAvailable){
    const hint = document.getElementById("hint1");
    hint.remove()
  }
  currentStep = 0;
}

// Move to the next step
function nextStep() {
  currentStep++;
  if (currentStep < tourSteps.length) {
    updateButtonVisibility();
    showStep(currentStep);
  } else {
    endTour();
  }
}

// Event listener for the Next button
nextButton.addEventListener("click", nextStep);