import { useNavigate } from "react-router-dom";
// import socket from "../../../socket";
import { Connect4GameContext } from "../../../context/Connect4GameContext";
import { useContext, useEffect, useRef, useState } from "react";
import { updateCurrentPlayer, createBoard } from "../../../utils/functions";
import { AppContext } from "../../../context/appContext";

function randomId() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function generateUsername() {
  return `Player${randomId()}`;
}

export default function Multiplayer() {
  const navigate = useNavigate();
  const gameContext = useContext(Connect4GameContext);
  const { socket, connect } = useContext(Connect4GameContext);
  const [username, setUsername] = useState("");
  const roomId = useRef(null);
  const currentPlayer = useRef(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isButtonClickedRef = useRef(false);
  const appContext = useContext(AppContext);

  const handleSearch = () => {
    isButtonClickedRef.current = true;
    setIsButtonClicked(true);
    if (!socket) {
      connect();
    } else if (socket.connected) {
      currentPlayer.current = {
        id: appContext?.loggedIn ? appContext?.currentUser?.id : null,
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
        elo: appContext.loggedIn ? appContext?.currentUser?.elo : null,
      };
      gameContext.setBoardList(createBoard(7, 6));
      socket.emit(
        "createRoom",
        currentPlayer.current,
        createBoard(7, 6),
        "matchmaking"
      );
    } else {
      socket.connect();
    }
    gameContext.setBoardList(createBoard(7, 6));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("roomJoined", (data) => {
      roomId.current = data;
      currentPlayer.current = {
        id: appContext?.loggedIn ? appContext?.currentUser?.id : null,
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
        elo: appContext.loggedIn ? appContext?.currentUser?.elo : null,
      };
      gameContext.setCurrentPlayer(currentPlayer.current);
    });

    const handleConnect = () => {
      if (!isButtonClicked) return;
      currentPlayer.current = {
        id: appContext?.loggedIn ? appContext?.currentUser?.id : null,
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
        elo: appContext.loggedIn ? appContext?.currentUser?.elo : null,
      };
      gameContext.setBoardList(createBoard(7, 6));
      socket?.emit(
        "createRoom",
        currentPlayer.current,
        createBoard(7, 6),
        "matchmaking"
      );
      isButtonClickedRef.current = false;
      setIsButtonClicked(false);
    };

    socket.on("connect", handleConnect);

    return () => {
      if (socket) {
        socket.off("roomJoined");
        socket.off("connect");
      }
    };
  }, [socket, isButtonClicked]);

  useEffect(() => {
    if (
      gameContext.currentPlayer &&
      gameContext.currentPlayer.roomId &&
      gameContext.boardList.length > 0
    ) {
      navigate("/connect4/1234");
    }
  }, [
    gameContext.boardList,
    roomId,
    gameContext.currentPlayer,
    navigate,
    appContext.currentUser,
  ]);

  useEffect(() => {
    setUsername(appContext.currentUser?.username || generateUsername());

  }, [appContext.currentUser]);

  return (
    <>
      <form className="flex flex-col justify-center items-center my-20">
        <div className="mb-6">
          <label className="block mb-2 text-xl font-medium text-gray-900 text-white">
            Username
          </label>
          <input
            type="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
        </div>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          Search for a game
        </button>
      </form>
    </>
  );
}
