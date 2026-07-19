import crypto from "crypto";

function encode_scene_item(sceneName, itemName) {
    return `${sceneName}.${itemName}`;
}

export class OBS {
    constructor(url, password) {
        this.socket = new WebSocket(url);
        this.password = password;
        this.authenticated = false;
        this.known_items = {};

        this.socket.addEventListener("message", (event) => {
            this.handleMessage(JSON.parse(event.data));
        });

        this.socket.addEventListener("open", (event) => {
            console.log("WebSocket connection established");
        });

        this.socket.addEventListener("close", (event) => {
            console.log(
                "WebSocket connection closed:",
                event.code,
                event.reason,
            );
        });

        this.socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });
    }

    send(data, force = false) {
        if (this.authenticated || force) {
            this.socket.send(JSON.stringify(data));
        }
    }

    authenticate(msg) {
        const { salt, challenge } = msg.d.authentication;

        const secret = crypto
            .createHash("sha256")
            .update(this.password + salt, "utf-8")
            .digest()
            .toString("base64");

        const authentication = crypto
            .createHash("sha256")
            .update(secret + challenge, "utf-8")
            .digest("base64")
            .toString("base64");

        this.send({ op: 1, d: { rpcVersion: 1, authentication } }, true);
    }

    requestItemId(sceneName, itemName) {
        this.send({
            op: 6,
            d: {
                requestType: "GetSceneItemId",
                requestId: encode_scene_item(sceneName, itemName),
                requestData: {
                    sceneName: sceneName,
                    sourceName: itemName,
                },
            },
        });
    }

    initialize() {
        this.send({
            op: 6,
            d: {
                requestType: "GetSourceFilter",
                requestId: "",
                requestData: {
                    sourceName: "BLEND",
                    filterName: "Invert",
                },
            },
        });

        this.send({
            op: 6,
            d: {
                requestType: "GetSceneItemTransform",
                requestId: "",
                requestData: {
                    sceneName: "BLEND",
                    sceneItemId: 2,
                },
            },
        });

        this.requestItemId("Foreground", "Camera 1");
        this.requestItemId("Foreground", "Camera 2");
        this.requestItemId("Foreground", "Camera 3");
        this.requestItemId("Foreground", "Camera 4");
        this.requestItemId("Background", "Camera 1");
        this.requestItemId("Background", "Camera 2");
        this.requestItemId("Background", "Camera 3");
        this.requestItemId("Background", "Camera 4");
        this.requestItemId("Background", "Camera 5");
        this.requestItemId("Background", "Camera 6");
        this.requestItemId("Background", "Camera 7");
        this.requestItemId("BLEND", "Foreground");
    }

    handleRequestResponse(msg) {
        const { d } = msg;

        if (!d.requestStatus.result) {
            console.log(
                `Request '${d.requestType}' failed: ${d.requestStatus.comment}`,
            );
            return;
        }

        switch (d.requestType) {
            case "SetSceneItemTransform":
                break;
            case "GetSourceFilterList":
                console.log(d.responseData.filters);
                break;
            case "GetSourceFilterDefaultSettings":
                console.log(d.responseData.defaultFilterSettings);
                break;
            case "GetSceneItemId":
                this.known_items[d.requestId] = d.responseData.sceneItemId;
                console.log(`Located scene item ${d.requestId}`);
                console.log(this.known_items);
                break;
            default:
                console.log(d);
        }
    }

    handleMessage(msg) {
        switch (msg.op) {
            case 0:
                this.authenticate(msg);
                break;
            case 2:
                console.log("Authenticated with OBS");
                this.authenticated = true; // TODO: actually check the password was accepted
                this.initialize();
                break;
            case 7:
                this.handleRequestResponse(msg);
                break;
        }
    }

    // Public methods
    setFilterSettings(sourceName, filterName, filterSettings) {
        this.send({
            op: 6,
            d: {
                requestType: "SetSourceFilterSettings",
                requestId: "",
                requestData: {
                    sourceName,
                    filterName,
                    filterSettings,
                },
            },
        });
    }

    setVisibility(sceneName, itemName, visible) {
        var sceneItemId =
            this.known_items[encode_scene_item(sceneName, itemName)];

        this.send({
            op: 6,
            d: {
                requestType: "SetSceneItemEnabled",
                requestId: "",
                requestData: {
                    sceneName,
                    sceneItemId,
                    sceneItemEnabled: visible,
                },
            },
        });
    }

    setItemTransform(sceneName, itemName, transformData) {
        var sceneItemId =
            this.known_items[encode_scene_item(sceneName, itemName)];

        this.send({
            op: 6,
            d: {
                requestType: "SetSceneItemTransform",
                requestId: "",
                requestData: {
                    sceneName,
                    sceneItemId,
                    sceneItemTransform: transformData,
                },
            },
        });
    }
}
