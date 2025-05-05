import "./GameOver.css";

import { useEffect, useState } from "react";

const GameOver = ({ retry, score, pickedWord }) => {
  const [showWord, setShowWord] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWord(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>Fim de jogo</h1>
      {score > 0 ? (
        <h2>
          Parabéns. <br /> Sua pontuação foi: <span>{score}</span>
        </h2>
      ) : (
        <h2>Tente novamente</h2>
      )}
      {showWord && (
        <p>
          {" "}
          A palavra era: <span>{pickedWord}</span>{" "}
        </p>
      )}
      <button onClick={retry}>Resetar jogo</button>
    </div>
  );
};

export default GameOver;
