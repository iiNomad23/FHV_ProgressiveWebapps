import {giveMePi} from "./modules/madhava-leibniz.js";

onmessage = (event) => {
    let data = event.data ?? {};

    switch (data.message) {
        case "giveMePi":
            let seconds = data.seconds ?? 5;
            let pi = giveMePi(seconds);
            postMessage({ message: data.message, pi: pi });
            break;

        default:
            postMessage({ message: "" });
    }
}

onerror = (errorEvent) => {
    console.log(`Error in worker: ${errorEvent.message}`);
}
