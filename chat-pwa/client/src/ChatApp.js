/**
 * Includes chat views and chat logic
 */

import {DefaultAPI} from "./Api.js";
import {ConversationManager} from "./ConversationManager.js";

export class ChatApp {

    static users = null;
    static currentUser = null;
    static currentConversationUser = null;

    static displayUserSelection(registerConversationCallback, logoutCallback) {
        this.logout();

        let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
        mainContainerEl.innerHTML = this.createUserSelectionHTML();

        let imageContainerEls = document.getElementsByClassName('imageContainer');
        for (let i = 0; i < imageContainerEls.length; i++) {
            imageContainerEls[i].addEventListener('click', (e) => {
                let username = e.target.getAttribute('data-username');
                this.currentUser = this.users.find(item => item.username === username);

                this.prepareChatViewHtml(logoutCallback);
                ConversationManager.createConversations(registerConversationCallback);
            });
        }
    }

    static prepareChatViewHtml(logoutCallback) {
        let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
        mainContainerEl.innerHTML = this.createChatViewHTML();

        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
        selectedUserEl.innerHTML = this.createUserAvatarHTML(this.currentUser.username);

        selectedUserEl.addEventListener("click", () => {
            logoutCallback();
        });
    }

    static logout() {
        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];

        this.currentUser = null;
        this.currentConversationUser = null;
        localStorage.removeItem("chat-pwa-conversation-path");

        selectedUserEl.innerHTML = "<span>SignIn</span>";
        selectedUserEl.replaceWith(selectedUserEl.cloneNode(true)); // remove all listener
    }

    static createUserSelectionHTML() {
        if (this.users == null || !Array.isArray(this.users)) {
            console.error("user object invalid\nuser object must be of type array");
            return "No users";
        }

        let html = "<div class='userSelectionContainer flexContainer'>";

        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];
            if (user == null) {
                continue;
            }

            html += "<div class='imageContainer' data-username='" + user.username + "'>";
            html += "<img src='" + DefaultAPI.serverUrl + "/images/" + user.username + ".jpg' alt='avatar'>";
            html += "</div>";
        }

        html += "</div>";

        return html;
    }

    static createChatViewHTML() {
        let html = "<div class='conversationCardContainer'></div>";
        html += "<div class='conversationContainer'></div>";
        return html;
    }

    static createUserAvatarHTML(username) {
        let html = "<div class='imageContainer'>";
        html += "<img src='" + DefaultAPI.serverUrl + "/images/" + username + ".jpg' alt='avatar'>";
        html += "</div>";
        return html;
    }
}
