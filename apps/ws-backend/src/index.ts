import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws,request) => {
  const url = request.url;
  if(!url) {
    return;
  }
  const urlParams = new URLSearchParams(url.split("?")[1]);
  const token = urlParams.get("token") || "";
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded || !(decoded as JwtPayload).userID) {
    ws.close(4000, "Unauthorized");
    return;
  }
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Echo: ${message}`);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});