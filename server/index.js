const crypto = require("crypto");

const socket = new WebSocket("ws://localhost:4455");
const password = "lLiFbK5a3EV2IvjH";

function authenticate(socket, msg, password) {
    const { salt, challenge } = msg.d.authentication;

    const secret = crypto
        .createHash("sha256")
        .update(password + salt, "utf-8")
        .digest()
        .toString("base64");

    const authentication = crypto
        .createHash("sha256")
        .update(secret + challenge, "utf-8")
        .digest("base64")
        .toString("base64");

    socket.send(
        JSON.stringify({ op: 1, d: { rpcVersion: 1, authentication } }),
    );
}

function setColorFilter(sourceName, filterSettings) {
    socket.send(
        JSON.stringify({
            op: 6,
            d: {
                requestType: "SetSourceFilterSettings",
                requestId: "",
                requestData: {
                    sourceName,
                    filterName: "Color Correction",
                    filterSettings,
                },
            },
        }),
    );
}

function onRequestResponse(msg) {
    const { d } = msg;

    if (!d.requestStatus.result) {
        console.log(
            `Request '${d.requestType}' failed: ${d.requestStatus.comment}`,
        );
        return;
    }

    switch (d.requestType) {
        case "GetSourceFilterList":
            console.log(d.responseData.filters);
            break;
        case "GetSourceFilterDefaultSettings":
            console.log(d.responseData.defaultFilterSettings);
            break;
        default:
            console.log(d);
    }
}

socket.addEventListener("open", (event) => {
    console.log("WebSocket connection established");
});

socket.addEventListener("message", (event) => {
    var msg = JSON.parse(event.data);

    switch (msg.op) {
        case 0:
            authenticate(socket, msg, password);
            break;
        case 2:
            console.log("Authenticated with OBS");
            break;
        case 7:
            onRequestResponse(msg);
            break;
    }
});

socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);
});

socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
});

setTimeout(() => {
    // socket.send(
    //     JSON.stringify({
    //         op: 6,
    //         d: {
    //             requestType: "GetSceneList",
    //             requestId: "test",
    //             requestData: {
    //                 sourceName: "a",
    //             },
    //         },
    //     }),
    // );
    // socket.send(
    //     JSON.stringify({
    //         op: 6,
    //         d: {
    //             requestType: "GetSceneItemList",
    //             requestId: "test",
    //             requestData: {
    //                 sceneName: "Scene",
    //             },
    //         },
    //     }),
    // );
    socket.send(
        JSON.stringify({
            op: 6,
            d: {
                requestType: "GetSourceFilterDefaultSettings",
                requestId: "test",
                requestData: {
                    filterKind: "color_filter_v2",
                },
            },
        }),
    );
    socket.send(
        JSON.stringify({
            op: 6,
            d: {
                requestType: "GetSourceFilterList",
                requestId: "test",
                requestData: {
                    sourceName: "Camera",
                },
            },
        }),
    );
    // socket.send(
    //     JSON.stringify({
    //         op: 6,
    //         d: {
    //             requestType: "GetSourceFilterDefaultSettings",
    //             requestId: "",
    //             requestData: {
    //                 "filterKind": ""
    //             },
    //         },
    //     }),
    // );
}, 1000);

var hue_shift = 0;

setInterval(() => {
    setColorFilter("Camera", {
        hue_shift,
    });

    hue_shift += 1;
}, 10);
