import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws:WebSocket,
  rooms : string[],
  userId : string
}
const users:User[] = [];

function checkUser(token:string){
  try{

    const decoded = jwt.verify(token, JWT_SECRET);
    if(typeof decoded === "string"){
      return null;
    }
    if(!decoded || !decoded.userId){
      return null;
    }
    return decoded.userId;
  }catch(err){
    console.log("Error verifying token", err);
    return null;
  }
}
wss.on("connection", (ws, request) => {
  const url = request.url; // ws://localhost:3000?token='123123'
  if (!url) return;
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  if (userId === null) {
    ws.close(); 
    return;
  }
  users.push({
    userId,
    ws,
    rooms: []
  })
  ws.on("message", (message) => {
    const parsedData = JSON.parse(message.toString());

    if(parsedData.type === "join_room"){
      const user = users.find(user => user.userId === userId);
      user?.rooms.push(parsedData.roomId);
  }
  if(parsedData.type === "leave_room"){
    const user = users.find(user => user.userId === userId);
    if(!user){
      return;
    }
    user.rooms = user.rooms.filter(room => room !== parsedData.roomId);
  }
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  })
});
