import { getTreasuryBalance } from "./Data";
import axios from "axios";
const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";

const coinPrice = async (coinId) => {
  const price = await axios.get(coinGeckoUrl, {
    params: {
      ids: coinId,
      vs_currency: "usd",
    },
  });
  return price.data[0].current_price;
};

const handleRay = async () => {
  return (await coinPrice("raydium")) + " USD";
};

const handleGrape = async () => {
  return (await coinPrice("grape-2")) + " USD";
};

const handleSol = async () => {
  return (await coinPrice("solana")) + " USD";
};

const handleMango = async () => {
  return (await coinPrice("mango-markets")) + " USD";
};

const handleSerum = async () => {
  return (await coinPrice("serum")) + " USD";
};

const handleTreasury = async (connection, realmId) => {
  let treasuryBalance = await getTreasuryBalance(connection, realmId);
  treasuryBalance = treasuryBalance + " SOL";
  return treasuryBalance;
};

export const commands = [
  {
    command: "/treasury",
    description: "Return DAO's treasury balance",
    response: handleTreasury,
  },
  {
    command: "/sol",
    description: "Return Solana price",
    response: handleSol,
  },
  {
    command: "/grape",
    description: "Return Grape Protocol token price",
    response: handleGrape,
  },
  {
    command: "/ray",
    description: "Return Raydium price",
    response: handleRay,
  },
  {
    command: "/mango",
    description: "Return Mango price",
    response: handleMango,
  },
  {
    command: "/serum",
    description: "Return Serum price",
    response: handleSerum,
  },
];

export async function ChatCommands(
  newMessage,
  connection,
  realmId,
  sendMessage,
  BOT_NAME
) {
  for (var index in commands) {
    const c = commands[index];
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
  }
}
