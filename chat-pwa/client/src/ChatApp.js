/**
 * Includes chat views and chat logic
 */

import {DefaultAPI} from "./Api.js";
import {ConversationManager} from "./ConversationManager.js";

export class ChatApp {

    static users = null;
    static currentUser = null;

    static async init() {
        if (this.users == null || this.currentUser == null) {
            await this.displayUserSelection();
        } else {
            let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
            selectedUserEl.innerHTML = this.createNavBarUserAvatarHTML(this.currentUser.username);

            await this.displayConversations();
        }
    }

    static async displayUserSelection() {
        try {
            this.users = await DefaultAPI.getUsers();

            let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
            mainContainerEl.innerHTML = this.createUserSelectionHTML();

            let imageContainerEls = document.getElementsByClassName('imageContainer');
            for (let i = 0; i < imageContainerEls.length; i++) {
                imageContainerEls[i].addEventListener('click', () => {
                    this.currentUser = this.users[i];

                    let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
                    mainContainerEl.innerHTML = this.createChatViewHTML();

                    let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
                    selectedUserEl.innerHTML = this.createNavBarUserAvatarHTML(this.currentUser.username);

                    this.displayConversations();
                });
            }
        } catch (e) {
            console.error("fetch getUsers failed");
        }
    }

    static async displayConversations() {
        let conversations = await DefaultAPI.getConversations();
        if (conversations == null) {
            return; // TODO: add html that no conversation exist
        }

        conversations = conversations
            .filter(item => item.participants.includes(this.currentUser.username));

        ConversationManager.createConversationCards(conversations, this.users, this.currentUser);
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

            html += "<div class='imageContainer'>";
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

    static createNavBarUserAvatarHTML(username) {
        let html = "<div class='imageContainer'>";
        html += "<img src='" + DefaultAPI.serverUrl + "/images/" + username + ".jpg' alt='avatar'>";
        html += "</div>";
        return html;
    }
}
