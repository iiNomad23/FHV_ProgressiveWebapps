/**
 * Entry point
 */

import {ChatApp} from "./ChatApp.js";
import {DefaultAPI} from "./Api.js";
import {createHashHistory} from "https://unpkg.com/history/history.production.min.js";

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

    let savedUserName = localStorage.getItem("chat-pwa-username");

    let history = createHashHistory();
    history.listen(({action, location}) => {

        switch (location.pathname) {
            case "/login":
                ChatApp.currentUser = null;
                ChatApp.displayUserSelection((user) => {
                    let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
                    selectedUserEl.innerHTML = ChatApp.createNavBarUserAvatarHTML(user.username);

                    ChatApp.currentUser = ChatApp.users.find(item => item.username === user.username);

                    history.push("/chat");
                });

                break;

            case "/chat":
            default:
                ChatApp.displayConversations().then(r => {});
        }
    });

    DefaultAPI.getUsers().then(
        (result) => {
            ChatApp.users = result;
            if (savedUserName == null) {
                history.push("/login");
            } else {
                ChatApp.currentUser = ChatApp.users.find(item => item.username === savedUserName);
                history.push("/chat");
            }
        },
        (err) => {
            console.error(`fetch getUsers failed: ${err}`);
        }
    );

}, false);
