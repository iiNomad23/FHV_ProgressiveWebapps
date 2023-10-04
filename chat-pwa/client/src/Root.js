/**
 * Entry point
 */

import {ChatApp} from "./ChatApp.js";
import {createBrowserHistory} from "../node_modules/history/history.development.js";

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log(`Success: ${registration.scope}`);
            })
            .catch((error) => {
                console.warn(`Error: registration failed with ${error}`);
            });
    }

    createBrowserHistory().push("/");

    ChatApp.init().then(() => {
        console.log("init");
    });
}, false);
