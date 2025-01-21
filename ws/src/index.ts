import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
    console.log("koi aaya")
    UserManager.getInstance().addUser(ws);
});