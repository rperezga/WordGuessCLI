const Word = require("./word.js");
const inquirer = require("inquirer");

const wordList = [ "elephant", "movie", "plane", "water" ];

let guesses;
let pickedWords;
let word;
let pickedWord;

function init() {
  pickedWords = [];
  console.log("Hello, try to guess a word!");
  console.log("-----------------------------");
  playGame();
}

function playGame() {
  pickedWord = "";
  guesses = 10;
  if(pickedWords.length < wordList.length) {
    pickedWord = getWord();
  } else {
    // WIN CONDITION
    console.log("You know a lot about your celestial neighborhood. Cheers!");
    continuePrompt();
  }
  if(pickedWord) {
    word = new Word(pickedWord);
    word.makeLetters();
    makeGuess();
  }
}

function getWord() {
  let rand = Math.floor(Math.random() * wordList.length);
  let randomWord = wordList[rand];
  if(pickedWords.indexOf(randomWord) === -1) {
    pickedWords.push(randomWord);
    return randomWord;
  } else {
    return getWord();
  }
}

function makeGuess() {
  let checker = [];
  inquirer.prompt([
    {
      name: "guessedLetter",
      message: word.update() + 
              "\nGuess a letter!" +
              "\nGuesses Left: " + guesses + "\n"
    }
  ])
  .then(data => {
    word.letters.forEach(letter => {
      letter.checkLetter(data.guessedLetter);
      checker.push(letter.getCharacter());
    });
    if(guesses > 0 && checker.indexOf("_") !== -1) {
      guesses--;
      if(guesses === 0) {
        console.log("Game over.");
        continuePrompt();
      } else {
        makeGuess();
      }
    } else {
      console.log("Congratulation!");
      console.log(word.update());
      playGame();
    }
  });
}

function continuePrompt() {
  inquirer.prompt([
      {
        name: "continue",
        type: "list",
        message: "You want to play again?",
        choices: ["Yes", "No"]
      }
    ])
  .then(data => {
      if(data.continue === "Yes") {
        init();
      } else {
        console.log("Bye!");
      }
  });
}

init();