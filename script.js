// 


const texts = [
  "Once upon a time, in a quiet French village, lived a kind and intelligent girl named Belle. She loved books and dreamed of a life filled with adventure beyond her small town. One day, her father Maurice got lost in the woods and stumbled upon a mysterious enchanted castle, where he was imprisoned by a fearsome Beast. Without hesitation, Belle went to rescue him and bravely offered to take his place.",
  "Though the Beast appeared terrifying, Belle soon discovered that beneath his rough exterior was a gentle soul. The enchanted objects of the castle Lumière the candelabra, Cogsworth the clock, Mrs. Potts the teapot, and her son Chip-welcomed Belle warmly and hoped she could break the curse that held them all.",
  "As time passed, Belle and the Beast grew close, sharing meals, dancing, and reading together. Slowly, their bond blossomed into true love. When Belle confessed her feelings, the spell was broken the Beast transformed back into a prince, and the castle came alive again.",
  "Belle and the Prince lived happily ever after, ruling with kindness and wisdom. Their magical tale reminded everyone that love and beauty come from within, not from appearances. It became one of the most beloved stories ever told."
];

let currentText = '';
let timer = 60;
let timerInterval = null;
let gameStarted = false;
let correctChars = 0;
let incorrectChars = 0;
let currentIndex = 0;
let typedHistory = [];

const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const timerDisplay = document.getElementById('timer');
const wpmStat = document.getElementById('wpmStat');
const accuracyStat = document.getElementById('accuracyStat');
const charsStat = document.getElementById('charsStat');
const restartBtn = document.getElementById('restartBtn');
const newTextBtn = document.getElementById('newTextBtn');
const resultModal = document.getElementById('resultModal');

function init() {
  setNewText();
  inputField.value = '';
  inputField.disabled = false;
  inputField.focus();
  gameStarted = false;
  correctChars = 0;
  incorrectChars = 0;
  currentIndex = 0;
  typedHistory = [];
  timer = 60;
  updateStats();
  updateTimer();
  resultModal.classList.remove('active');
}

function setNewText() {
  currentText = texts[Math.floor(Math.random() * texts.length)];
  displayText();
}

function displayText() {
  textDisplay.innerHTML = currentText
    .split('')
    .map((char, index) => `<span id="char${index}">${char}</span>`)
    .join('');
  highlightCurrentChar();
}

function highlightCurrentChar() {
  const prevChar = document.querySelector('.current');
  if (prevChar) prevChar.classList.remove('current');
  const currentChar = document.getElementById(`char${currentIndex}`);
  if (currentChar) currentChar.classList.add('current');
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateWPM() {
  const words = correctChars / 5;
  const minutes = (60 - timer) / 60;
  return Math.round(words / Math.max(minutes, 0.01));
}

function calculateAccuracy() {
  const totalChars = correctChars + incorrectChars;
  return totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);
}

function updateStats() {
  wpmStat.textContent = calculateWPM();
  accuracyStat.textContent = `${calculateAccuracy()}%`;
  charsStat.textContent = correctChars;
}

function resetCharState(index) {
  const charElement = document.getElementById(`char${index}`);
  if (charElement) {
    charElement.classList.remove('correct', 'incorrect');
  }
}

inputField.addEventListener('input', (e) => {
  const inputValue = e.target.value;

  if (!gameStarted && inputValue.length > 0) {
    gameStarted = true;
    startTimer();
    textDisplay.classList.add('active');
  }

  const backSpace = typedHistory.length > inputValue.length;

  if (backSpace) {
    if (currentIndex > 0) {
      currentIndex--;
      resetCharState(currentIndex);
      if (typedHistory[currentIndex]) {
        correctChars--;
      } else {
        incorrectChars--;
      }
      typedHistory = typedHistory.slice(0, currentIndex);
    }
  } else {
    if (currentIndex < currentText.length) {
      const currentChar = document.getElementById(`char${currentIndex}`);
      const expectedChar = currentText[currentIndex];
      const typedChar = inputValue[inputValue.length - 1];

      if (typedChar === expectedChar) {
        currentChar.classList.add('correct');
        correctChars++;
        typedHistory[currentIndex] = true;
      } else {
        currentChar.classList.add('incorrect');
        incorrectChars++;
        typedHistory[currentIndex] = false;
      }

      currentIndex++;
    }
  }

  highlightCurrentChar();
  updateStats();

  if (currentIndex >= currentText.length) {
    endGame();
  }
});

inputField.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault();
  }
});

function endGame() {
  clearInterval(timerInterval);
  inputField.disabled = true;
  textDisplay.classList.remove('active');

  document.getElementById('finalWPM').textContent = calculateWPM();
  document.getElementById('finalAccuracy').textContent = `${calculateAccuracy()}%`;
  document.getElementById('finalChars').textContent = correctChars;
  document.getElementById('finalErrors').textContent = incorrectChars;

  resultModal.classList.add('active');
}

function restartTest() {
  clearInterval(timerInterval);
  init();
}

restartBtn.addEventListener('click', restartTest);

newTextBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to change the text? Your current progress will be lost.")) {
    restartTest();
  }
});

textDisplay.addEventListener('copy', (e) => e.preventDefault());
textDisplay.addEventListener('mousedown', (e) => e.preventDefault());

init();
