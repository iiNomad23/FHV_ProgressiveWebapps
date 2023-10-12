/**
 * Entry point
 */

import {ChatApp} from "./ChatApp.js";
import {ConversationManager} from "./ConversationManager.js";
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
