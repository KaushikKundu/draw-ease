import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url; // ws://localhost:3000?token='123123'
  if (!url) return;
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  jwt.verify(token, JWT_SECRET, (err,decoded)=> {
    if(err){
      ws.send(JSON.stringify({ message: "Unauthorized" }));
      ws.close();
      return;
    }
    const decodedToken = decoded as JwtPayload;
    ws.send(JSON.stringify({message:"Authorized", userID: decodedToken.userID}));

  });
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    ws.send(`Hello! You sent -> ${message}`);
  }
  );
  ws.on("close", () => {
    console.log("Client disconnected");
  })
});
