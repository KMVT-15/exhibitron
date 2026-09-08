import { OBS } from "./obs.js";
import { Board } from "./board.js";
import { WebSocketServer } from "ws";
import { actions } from "./actions.js";
import * as dotenv from "dotenv";

dotenv.config();

var wss = new WebSocketServer({
    host: "0.0.0.0",
    port: process.env.CONTROL_SERVER_PORT,
});
var obs = new OBS(process.env.OBS_WS_URL, process.env.OBS_WS_PASSWORD);
var board = new Board();

board.onChange((params) => {
    console.log(params);

    for (const [k, v] of Object.entries(params)) {
        if (actions[k]) {
            actions[k](obs, v, board);
        }
    }
});

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        board.set(JSON.parse(data).params);
        for (const client of wss.clients) {
            if (client.readyState === client.OPEN) {
                client.send(data);
            }
        }
    });
});
