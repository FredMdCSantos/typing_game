// inside script.js
// all of our quotes
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
// store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;
// the starting time
let startTime = Date.now();
// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const textbox = document.getElementById('textbox');
const participant = document.getElementById('participantName');
const addParticipantDiv = document.getElementById('addPlayer');
const addButton = document.getElementById('addButton');
let elapsedTime;
let quoteIndex;

startButton.addEventListener('click', startEvent);
textbox.hidden = true;
addParticipantDiv.hidden = true;
addButton.addEventListener('click', showStart);
document.getElementById('scoreboard').hidden = true;

function showStart() {
  startButton.hidden = false;
  addParticipantDiv.hidden = true;
  document.getElementById('scoreboard').hidden = false;
}

// at the end of script.js
function startEvent() {
    // get a quote
    quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    // Put the quote into an array of words
    words = quote.split(' ');
    // reset the word index for tracking
    wordIndex = 0;
  
    // UI updates
    // Create an array of span elements so we can set a class
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    // Convert into string and set as innerHTML on quote display
    quoteElement.innerHTML = spanWords.join('');
    // Highlight the first word
    quoteElement.childNodes[0].className = 'highlight';
    // Clear any prior messages
    messageElement.innerText = '';
  
    // Setup the textbox
    // Clear the textbox
    typedValueElement.value = '';
    // set focus
    typedValueElement.focus();
    // set the event handler
    typedValueElement.addEventListener('input', inputValue);
    quoteElement.hidden = false;
    textbox.hidden = false;
    startButton.hidden = true;
    addParticipantDiv.hidden = true;
    // Start the timer
    startTime = new Date().getTime();
  };

// at the end of script.js
function inputValue () {
    // Get the current word
    const currentWord = words[wordIndex];
    // get the current value
    const typedValue = typedValueElement.value;
  
    if (typedValue === currentWord && wordIndex === words.length - 1) {
      // end of sentence
      // Display success
      elapsedTime = new Date().getTime() - startTime;

      const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;

      messageElement.innerText = message;
      //resets participant value
      participant.value = '';
      //enables participant check in and disables input text and start button 
      textbox.hidden = true;
      startButton.hidden = true;
      addParticipantDiv.hidden = false;
      quoteElement.hidden = true;
      //disables type-value event
      typedValueElement.removeEventListener('input', inputValue);

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
      // end of word
      // clear the typedValueElement for the new word
      typedValueElement.value = '';
      // move to the next word
      wordIndex++;
      // reset the class name for all elements in quote
      for (const wordElement of quoteElement.childNodes) {
        wordElement.className = '';
      }
      // highlight the new word
      quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
      // currently correct
      // highlight the next word
      typedValueElement.className = '';
    } else {
      // error state
      typedValueElement.className = 'error';
    }
};

function saveScore() {
  localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
};

function loadScore() {
  const data = localStorage.getItem('scoreboard');
  if (data) {
      scoreboard = JSON.parse(data);
      updateScoreboard();
  }
};

let participants = [];

function addParticipant() {
  const playerName = participant.value.trim();
  const quoteSelected = quotes[quoteIndex];
  const score = elapsedTime/1000;

  participants.push({ playerName, quoteSelected, score });

  participant.value = "";
  elapsedTime = "";

  saveScore();
  updateScoreboard();
};

function updateScoreboard() {
  const scoreboardBody = document.getElementById("scoreboardBody");

  // Clear existing rows in the table
  scoreboardBody.innerHTML = "";

  // Sort the scoreboard in ascending order based on the scores
  participants.sort((a, b) => a.score - b.score);

  // Populate the table with updated scoreboard data
  for (const player of participants) {
      const row = document.createElement("tr");
      const quoteCell = document.createElement("td");
      const playerNameCell = document.createElement("td");
      const scoreCell = document.createElement("td");

      quoteCell.textContent = player.quoteSelected;
      playerNameCell.textContent = player.playerName;
      scoreCell.textContent = player.score;

      row.appendChild(quoteCell);
      row.appendChild(playerNameCell);
      row.appendChild(scoreCell);
      scoreboardBody.appendChild(row);
  };
};

loadScore();

