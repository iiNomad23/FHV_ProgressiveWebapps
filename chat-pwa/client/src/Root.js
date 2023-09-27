/**
 * Entry point
 */

document.addEventListener('DOMContentLoaded', () => {
    ChatApp.init().then(() => {
        console.log("init");
    });
}, false);