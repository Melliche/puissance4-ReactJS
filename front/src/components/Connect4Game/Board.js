import Column from "./Column";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useContext, useEffect, useRef, useState } from "react";
import { createBoard } from "../../utils/functions";
import { useNavigate } from "react-router-dom";

export default function Board() {
  const gameContext = useContext(Connect4GameContext);
  const [boardList, setBoardList] = useState(gameContext.boardList);
  const [currentPlayer, setCurrentPlayer] = useState(gameContext.currentPlayer);
  const [isOpen, setIsOpen] = useState(false);
  const [victory, setVictory] = useState(false);
  const [opponentWantsToPlayAgain, setOpponentWantsToPlayAgain] =
    useState(false);
  const opponentWantsRestart = useRef(false);
  const [currentWantsToPlayAgain, setCurrentWantsToPlayAgain] = useState(false);
  const currentWantsRestart = useRef(false);
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const { socket, connect } = useContext(Connect4GameContext);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("victory", (socketId, draw) => {
      setIsOpen(true);
      if (draw) {
        return setDraw(true);
      } else if (socketId === socket.id) {
        setVictory(true);
      }
    });

    socket.on("play-again", (playerWantsToRestartId) => {
      if (playerWantsToRestartId === socket.id) {
        currentWantsRestart.current = true;
        setCurrentWantsToPlayAgain(currentWantsRestart.current);
      } else {
        opponentWantsRestart.current = true;
        setOpponentWantsToPlayAgain(opponentWantsRestart.current);
      }

      if (currentWantsRestart.current && opponentWantsRestart.current) {
        setIsOpen(false);
        console.log("reset board");
        setResetRequested(true);
        currentWantsRestart.current = false;
        opponentWantsRestart.current = false;
        setCurrentWantsToPlayAgain(false);
        setOpponentWantsToPlayAgain(false);
      }
    });

    socket.on("startGame", (players) => {
      players.forEach((player) => {
        if (player.socketId === socket.id) {
          gameContext.setCurrentPlayer(player);
        } else {
          if (player) {
            gameContext.setOpponent(player);
          }
        }
      });
    });

    socket.on("opponent-disconnected", () => {
      setAlertMessage("Your opponent has disconnected.");
      new Promise((resolve) =>
        setTimeout(() => {
          setAlertMessage(null);
          gameContext.setCurrentPlayer(null);
          socket.disconnect();
          resolve();
        }, 5000)
      );
    });
  }, []);

  useEffect(() => {
    if (!gameContext.currentPlayer && !socket) {
      navigate("/connect4");
    }
    setBoardList(gameContext.boardList);

    if (resetRequested) {
      const board = createBoard(7, 6);
      gameContext.setBoardList(board);

      socket.emit("startGame", board);

      setResetRequested(false);
    }

    setCurrentPlayer(gameContext.currentPlayer);
  }, [
    alertMessage,
    boardList,
    gameContext,
    gameContext.boardList,
    gameContext.currentPlayer,
    navigate,
    resetRequested,
    socket,
  ]);

  function handlePlayAgain() {
    socket.emit("play-again", socket.id);
  }

  return (
    <section className="flex items-center justify-center dark:bg-gray-900">
      <div className="flex my-14 rounded-lg dark:bg-gray-600">
        {boardList.length > 0
          ? Array(boardList.length)
              .fill()
              .map((_, i) => (
                <Column key={i} id={i} resetRequested={resetRequested}></Column>
              ))
          : ""}
      </div>
      {isOpen && (
        <div
          id="popup-modal"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div className="bg-red-500 bg-yellow-500"></div>
          <div className="relative z-20 text-center bg-white rounded-lg shadow dark:bg-gray-700 px-2 py-4">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>

            <h3 className=" mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {draw ? "DRAW" : victory ? "VICTORY" : "DEFEAT"}
            </h3>
            <h2 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {opponentWantsToPlayAgain === true
                ? "Your opponent wants to play again"
                : currentWantsToPlayAgain === true
                ? "waiting for your opponent"
                : ""}
            </h2>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={() => {
                handlePlayAgain();
              }}
            >
              Play again
            </button>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => {
                gameContext.setCurrentPlayer(null);
                socket.disconnect();
              }}
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md z-50">
          {alertMessage}
        </div>
      )}
    </section>
  );
}
