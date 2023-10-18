/**
 * Entry point
 */

import {ChatApp} from "./ChatApp.js";
import {ConversationManager} from "./ConversationManager.js";
import {DefaultAPI} from "./Api.js";
import {createHashHistory} from "../lib/history.production.min.js";

window.onresize = () => {
    ChatApp.checkViews(true);
};

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                if (registration.installing) {
                    // dirty workaround for "client not caching if it is the first time for the service worker"
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                }
            })
            .catch((error) => {
                console.warn(`Error: registration failed with ${error}`);
            });
    }

    let history = createHashHistory();
    history.listen(({action, location}) => {

        if (ChatApp.currentUser != null && ChatApp.currentConversationUser != null) {
            if (location.pathname === `/${ChatApp.currentUser.username}/chat/${ChatApp.currentConversationUser.username}`) {
                ConversationManager.displayConversation();
                return;
            } else {
                registerNewUserAndConversation(history, location.pathname);
                return;
            }
        }

        if (location.pathname !== "/login") {
            history.replace("/login");
            return;
        }

        ChatApp.displayUserSelection(
            (user, conversationUser) => {
                registerConversation(history, user, conversationUser);
            },
            () => {
                history.push("/login");
            }
        );
    });

    DefaultAPI.getUsers().then(
        (result) => {
            ChatApp.users = result;

            let conversationPath = localStorage.getItem("chat-pwa-conversation-path");
            registerNewUserAndConversation(history, conversationPath);
        },
        (err) => {
            console.error(`fetch getUsers failed: ${err}`);

            let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
            mainContainerEl.innerHTML = "<span class='loader'></span>";

            document.querySelector('.selectedUser span').textContent = "You're offline :(";
        }
    );
}, false);

function registerConversation(history, user, conversationUser) {
    try {
        localStorage.setItem("chat-pwa-conversation-path", `/${user.username}/chat/${conversationUser.username}`)
        history.push(`/${user.username}/chat/${conversationUser.username}`);
    } catch (e) {
        history.push("/login");
    }
}

function registerNewUserAndConversation(history, path) {
    try {
        let savedUserName = path.split("/")[1];
        let savedConversationUserName = path.split("/")[3];

        ChatApp.currentUser = ChatApp.users.find(item => item.username === savedUserName);
        ChatApp.currentConversationUser = ChatApp.users.find(item => item.username === savedConversationUserName);

        if (ChatApp.currentUser != null) {
            ChatApp.prepareChatViewHtml(() => {
                history.push("/login");
            });
            ConversationManager.createConversations((user, conversationUser) => {
                registerConversation(history, user, conversationUser);
            });
        } else {
            history.push("/login");
        }
    } catch (e) {
        history.push("/login");
    }
}
