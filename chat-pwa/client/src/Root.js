/**
 * Entry point
 */

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

    ChatApp.init().then(() => {
        console.log("init");
    });
}, false);