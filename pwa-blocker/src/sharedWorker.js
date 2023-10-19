import {giveMePi} from "./modules/madhava-leibniz.js";

const ports = new Set();

function broadcastMessage(message) {
    for (const port of ports) {
        try {
            port.postMessage(message);
        } catch (err) {
            ports.delete(port);
        }
    }
}

self.onconnect = (connectEvent) => {
    const port = connectEvent.ports[0];
    ports.add(port);
    port.onmessage = (event) => {
        let data = event.data ?? {};

        switch (data.message) {
            case "giveMePi":
                let seconds = data.seconds ?? 5;
                broadcastMessage({ message: "running"});
                let pi = giveMePi(seconds);
                broadcastMessage({ message: data.message, pi: pi });
                break;

            default:
                broadcastMessage({ message: "" });
        }
    }
};

self.onerror = (errorEvent) => {
    console.log(`Error in sharedWorker: ${errorEvent.message}`);
}
