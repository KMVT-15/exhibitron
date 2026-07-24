import { OBS } from "./obs.js";
import { Board } from "./board.js";
import { WebSocketServer } from "ws";
import { actions } from "./actions.js";

var wss = new WebSocketServer({ host: "0.0.0.0", port: 8080 });
// var obs = new OBS("ws://localhost:4455", "lLiFbK5a3EV2IvjH");
var obs = new OBS("ws://10.10.3.50:4455", "password");
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
