
const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");

const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");
const errorsDisplay = document.getElementById("errors");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const message = document.getElementById("message");

// Different sentences for random tests
const sentences = [
    "Practice makes a person perfect in every skill.",
    "JavaScript helps developers build interactive websites.",
    "Technology makes communication faster and easier.",
    "Learning something new every day improves our skills.",
    "The quick brown fox jumps over the lazy dog.",
    "Web development combines creativity and programming.",
    "Consistency is the key to achieving your goals.",
    "Typing faster requires patience and daily practice.",
    "Computer science helps solve real world problems.",
    "Success comes from hard work and determination.",
    "A good programmer writes clean and readable code.",
    "HTML CSS and JavaScript work together to build websites."
];

let currentSentence = "";
let timer = null;
let startTime = 0;
let elapsedSeconds = 0;
let testStarted = false;
let testFinished = false;
let errorLetters = 0;

// Select a random sentence
function generateSentence() {
    const randomIndex = Math.floor(
        Math.random() * sentences.length
    );

    currentSentence = sentences[randomIndex];

    displaySentence();
}

// Display each character separately
function displaySentence() {
    textDisplay.innerHTML = "";

    for (const character of currentSentence) {
        const span = document.createElement("span");
        span.textContent = character;
        textDisplay.appendChild(span);
    }

    highlightCharacters();
}

// Highlight correct, incorrect and current characters
function highlightCharacters() {
    const typedText = typingInput.value;
    const characters = textDisplay.querySelectorAll("span");

    characters.forEach((span, index) => {
        span.className = "";

        if (index < typedText.length) {
            if (typedText[index] === currentSentence[index]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
        } else if (index === typedText.length) {
            span.classList.add("current");
        }
    });
}

// Calculate typing statistics
function updateStats() {
    const typedText = typingInput.value;

    let correctCharacters = 0;
    let incorrectCharacters = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (
            i < currentSentence.length &&
            typedText[i] === currentSentence[i]
        ) {
            correctCharacters++;
        } else {
            incorrectCharacters++;
        }
    }

    // Calculate WPM using correctly typed characters
    const minutes = elapsedSeconds / 60;

    const wpm = minutes > 0
        ? Math.round((correctCharacters / 5) / minutes)
        : 0;

    // Accuracy is based on all characters typed
    const accuracy = typedText.length > 0
        ? Math.round(
            (correctCharacters / typedText.length) * 100
        )
        : 100;

    errorLetters = incorrectCharacters;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + "%";
    errorsDisplay.textContent = errorLetters;
    timeDisplay.textContent = elapsedSeconds;
}

// Update elapsed time
function updateTimer() {
    elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
    );

    timeDisplay.textContent = elapsedSeconds;
    updateStats();
}

// Start a new typing test
function startTest() {
    if (testStarted) return;

    clearInterval(timer);

    // Reset the previous test
    elapsedSeconds = 0;
    testFinished = false;
    testStarted = true;
    typingInput.value = "";
    typingInput.disabled = false;

    // Generate a new random sentence
    generateSentence();

    // Record the starting time
    startTime = Date.now();

    startBtn.disabled = true;
    message.textContent = "Type the sentence as quickly and accurately as possible.";

    typingInput.focus();

    updateStats();

    // Update elapsed time every 100 milliseconds
    timer = setInterval(() => {
        updateTimer();
    }, 100);
}

// Finish the test
function finishTest() {
    if (testFinished) return;

    updateTimer();
    clearInterval(timer);

    testStarted = false;
    testFinished = true;
    typingInput.disabled = true;
    startBtn.disabled = false;

    message.textContent =
        `Test completed! WPM: ${wpmDisplay.textContent} | ` +
        `Accuracy: ${accuracyDisplay.textContent} | ` +
        `Time taken: ${elapsedSeconds} seconds | ` +
        `Incorrect letters: ${errorLetters}.`;
}

// Handle user typing
typingInput.addEventListener("input", () => {
    if (!testStarted || testFinished) return;

    highlightCharacters();
    updateStats();

    // Finish when the complete sentence has been typed
    if (typingInput.value.length >= currentSentence.length) {
        finishTest();
    }
});

// Start button
startBtn.addEventListener("click", startTest);

// Restart button
restartBtn.addEventListener("click", () => {
    clearInterval(timer);

    testStarted = false;
    testFinished = false;
    elapsedSeconds = 0;
    typingInput.value = "";
    typingInput.disabled = true;

    startBtn.disabled = false;

    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    timeDisplay.textContent = "0";
    errorsDisplay.textContent = "0";

    textDisplay.textContent =
        "Click Start Test to generate a random sentence.";

    message.textContent = "Ready for another test? Click Start Test.";

    currentSentence = "";
});

// Initial page state
textDisplay.textContent =
    "Click Start Test to generate a random sentence.";
