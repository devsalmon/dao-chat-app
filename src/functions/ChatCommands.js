import { getTreasuryBalance } from "../governance-functions/Data";
import axios from "axios";

export async function ChatCommands(
  newMessage,
  connection,
  realmId,
  sendMessage,
  BOT_NAME
) {
  const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";

  if (newMessage.message === "/treasury") {
    let treasuryBalance = await getTreasuryBalance(connection, realmId);
    treasuryBalance = treasuryBalance + " SOL";
    sendMessage({
      message: treasuryBalance,
      name: BOT_NAME,
      createdAt: Date.now(),
      isBot: true,
    });
  } else if (newMessage.message === "/sol") {
    let solPrice = await axios.get(coinGeckoUrl, {
      params: {
        ids: "solana",
        vs_currency: "usd",
      },
    });
    solPrice = solPrice.data[0].current_price + " USD";
    sendMessage({
      message: solPrice,
      name: BOT_NAME,
      createdAt: Date.now(),
      isBot: true,
    });
  } else if (newMessage.message === "/grape") {
    let grapePrice = await axios.get(coinGeckoUrl, {
      params: {
        ids: "grape-2",
        vs_currency: "usd",
      },
    });
    grapePrice = grapePrice.data[0].current_price + " USD";
    sendMessage({
      message: grapePrice,
      name: BOT_NAME,
      createdAt: Date.now(),
      isBot: true,
    });
  } else if (newMessage.message === "/ray") {
    let rayPrice = await axios.get(coinGeckoUrl, {
      params: {
        ids: "raydium",
        vs_currency: "usd",
      },
    });
    rayPrice = rayPrice.data[0].current_price + " USD";
    sendMessage({
      message: rayPrice,
      name: BOT_NAME,
      createdAt: Date.now(),
      isBot: true,
    });
  }
}
