import { getTreasuryBalance } from "./Data";
import axios from "axios";
const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";

const handleRay = async () => {
  let rayPrice = await axios.get(coinGeckoUrl, {
    params: {
      ids: "raydium",
      vs_currency: "usd",
    },
  });
  return rayPrice.data[0].current_price + " USD";
};

const handleGrape = async () => {
  let grapePrice = await axios.get(coinGeckoUrl, {
    params: {
      ids: "grape-2",
      vs_currency: "usd",
    },
  });
  return grapePrice.data[0].current_price + " USD";
};

const handleSol = async () => {
  let solPrice = await axios.get(coinGeckoUrl, {
    params: {
      ids: "solana",
      vs_currency: "usd",
    },
  });
  return solPrice.data[0].current_price + " USD";
};

const handleTreasury = async (connection, realmId) => {
  let treasuryBalance = await getTreasuryBalance(connection, realmId);
  treasuryBalance = treasuryBalance + " SOL";
  return treasuryBalance;
};

export const commands = [
  {
    command: "/treasury",
    description: "View the treasury balance of the DAO",
    response: handleTreasury,
  },
  {
    command: "/sol",
    description: "View the current dollar price of Solana",
    response: handleSol,
  },
  {
    command: "/grape",
    description: "View the current dollar price of the Grape Protocol token",
    response: handleGrape,
  },
  {
    command: "/ray",
    description: "View the current dollar price of Raydium",
    response: handleRay,
  },
];

export async function ChatCommands(
  newMessage,
  connection,
  realmId,
  sendMessage,
  BOT_NAME
) {
  commands.forEach(async (c) => {
    if (newMessage === c.command) {
      // respond to the command with appropriate response
      const response = await c.response(connection, realmId);
      sendMessage({
        message: response,
        name: BOT_NAME,
        createdAt: Date.now(),
        isBot: true,
      });
    }
  });
}
