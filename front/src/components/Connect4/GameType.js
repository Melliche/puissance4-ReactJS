import { useState } from "react";
import CreateRoom from "./SelectGameType/CreateRoom";
import JoinRoom from "./SelectGameType/JoinRoom";
import Multiplayer from "./SelectGameType/Multiplayer";

export default function GameType() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const buttonStyleClicked = "text-white text-xl";

  const baseStyle =
    "inline-block w-full text-lg sm:text-2xl p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none bg-gray-700 hover:bg-gray-600";

  return (
    <div className="row-start-1 lg:col-start-1 lg:col-span-2 border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700 min-w-full">
      <ul className="flex flex-col sm:flex-row text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg divide-gray-600 text-gray-400">
        {["Multiplayer", "Room"].map((item, index) => {
          return (
            <li key={index} className="w-full">
              <button
                className={`${baseStyle} ${
                  index === 0
                    ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                    : null
                } ${index === 1 ? "sm:rounded-tr-lg " : ""} + ${
                  index === activeTab ? buttonStyleClicked : null
                }}`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex h-auto justify-center items-center">
        {activeTab === 0 ? <Multiplayer></Multiplayer> : <JoinRoom></JoinRoom>}
      </div>
    </div>
  );
}
