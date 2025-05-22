import { WebSocketServer } from "ws";
import fs from "fs/promises";
import path from "path";

const wss = new WebSocketServer({ port: 3003 });
console.log("LiveChart WebSocket server running on ws://localhost:3003");

const recipesFile = path.join(process.cwd(), "recipes.json");

wss.on("connection", async (ws) => {
  console.log("Client connected to LiveChart");

  const data = await fs.readFile(recipesFile, "utf-8");
  const recipes = JSON.parse(data);

  let index = 0;

  const sendRecipe = () => {
    if (index >= recipes.length) {
      index = 0;
    }
    const recipe = recipes[index++];
    const entry = {
      name: recipe.name,
      kcal: Number(recipe.kcal)
    };
    ws.send(JSON.stringify(entry));
  };

  sendRecipe();
  const interval = setInterval(sendRecipe, 2000); // every 2 seconds

  ws.on("close", () => {
    console.log(" Client disconnected");
    clearInterval(interval);
  });
});
