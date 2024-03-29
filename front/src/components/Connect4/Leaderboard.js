import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET_ALL_LEADERBOARDS } from "../../API/userRequest";
import { AppContext } from "../../context/appContext";

export default function Leaderboard() {
  const appContext = useContext(AppContext);
  const [leaderboards, setLeaderboards] = useState([]);

  const [getAllLeaderboards] = useLazyQuery(GET_ALL_LEADERBOARDS, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setLeaderboards(data.getAllLeaderboards);
    },
  });

  useEffect(() => {
    getAllLeaderboards();
  }, []);

  return (
    <>
      {appContext?.currentUser ? (
        <div className="col-span-1 relative min-w-full max-w-sm border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700">
          <div className="overflow-auto max-h-96">
            <div className="min-w-full divide-y divide-gray-200 divide-gray-700">
              <div className="grid grid-cols-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-200">
                <div className="col-span-2"></div>
                <div className="font-extrabold col-span-1 text-white text-md lg:text-lg my-4 text-center">
                  ELO
                </div>
                <div className="font-extrabold col-span-1 text-white text-md lg:text-lg my-4 text-center">
                  Wins
                </div>
              </div>
              <div className=" divide-y divide-gray-200 bg-gray-800 divide-gray-700">
                {leaderboards?.map((leaderboard) => {
                  return (
                    <div
                      key={leaderboard.username}
                      className="grid grid-cols-4 py-1.5 items-center"
                    >
                      <div className="px-6 col-span-2 whitespace-nowrap text-xl text-gray-500 text-gray-200">
                        {leaderboard.username}
                      </div>
                      <div className="flex flex-row col-span-1 justify-center text-sm">
                        <div
                          title="elo"
                          className="text-black font-extrabold text-lg px-1.5 text-green-400"
                        >
                          {leaderboard.elo}
                        </div>
                      </div>
                      <div className="flex flex-row col-span-1 justify-center text-sm">
                        <div
                          title="wins"
                          className="text-green-600 font-extrabold text-lg px-1.5 text-green-400"
                        >
                          {leaderboard.wins}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            onClick={() => getAllLeaderboards()}
            className="absolute text-white right-[0%] sm:right-[-5%] top-[-10%] sm:top-[-5%] h-fit bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm w-auto px-3 py-1.5 text-center"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="col-span-1 grid grid-rows-4 min-w-full max-w-sm border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700">
          <div className="row-start-2 text-center">
            <h1 className="text-white font-bold text-xl p-8">
              You need to be logged in to see the leaderboard
            </h1>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
