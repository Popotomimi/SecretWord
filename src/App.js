// CSS
import "./App.css";

// Hooks
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from "./data/words";

// Components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const hangmanParts = [
  "head",
  "body",
  "left-arm",
  "right-arm",
  "left-leg",
  "right-leg",
];

const guessesQty = 6;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const [wrongGuesses, setWrongGuesses] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);

      // Adicionando erro ao contador
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setWrongGuesses(0);

    setGameStage(stages[0].name);
  };

  return (
    <div>
      <Navbar />
      <div className="App">
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" && (
          <>
            <div className="game-layout">
              <div className="game-container">
                <Game
                  verifyLetter={verifyLetter}
                  pickedWord={pickedWord}
                  pickedCategory={pickedCategory}
                  letters={letters}
                  guessedLetters={guessedLetters}
                  wrongLetters={wrongLetters}
                  guesses={guesses}
                  score={score}
                />
              </div>

              <div className="hangman-container">
                <div className="gallows">
                  <div className="base"></div>
                  <div className="vertical"></div>
                  <div className="horizontal"></div>
                  <div className="rope"></div>
                </div>

                <div className="hangman">
                  {hangmanParts.slice(0, wrongGuesses).map((part, index) => (
                    <div key={index} className={`hangman-part ${part}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {gameStage === "end" && (
          <GameOver retry={retry} score={score} pickedWord={pickedWord} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
