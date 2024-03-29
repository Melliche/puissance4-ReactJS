const Game = require("../../models/Game");
const gameType = require("./types");
const jwt = require("jsonwebtoken");
const { getToken } = require("../../middleware/authUser");

const { GraphQLID, GraphQLList } = require("graphql");

const getGamesByUserId = {
  type: new GraphQLList(gameType),
  description: "Get a list of Games by user id",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args, context) => {
    let userId = args?.id;
    if (!userId) {
      userId = jwt.decode(getToken(context.headers), process.env.JWT_SECRET)
        ?.user?._id;
    }

    const games = await Game.find({
      $or: [{ "player1.id": userId }, { "player2.id": userId }],
    }).sort({ dateStarted: -1 });
    return games;
  },
};

module.exports = {
  getGamesByUserId,
};
