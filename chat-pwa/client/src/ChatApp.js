/**
 * Includes chat views and chat logic
 */

import {DefaultAPI} from "./Api.js";
import {ConversationManager} from "./ConversationManager.js";

export class ChatApp {

    static MOBILE_VIEW_THRESHOLD = 800;
    static VIEW_MODE = 0; // 0 -> desktop, 1 -> mobile

    static users = null;
    static currentUser = null;
    static currentConversationUser = null;

    static displayUserSelection(registerConversationCallback, logoutCallback) {
        this.logout();

        let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
        mainContainerEl.innerHTML = this.createUserSelectionHTML();

        this.checkViews();

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
        selectedUserEl.innerHTML = this.createNavBarContentHTML(this.currentUser.username);

        let imageContainerEl = selectedUserEl.getElementsByClassName("imageContainer")[0];
        imageContainerEl.addEventListener("click", () => {
            logoutCallback();
        });

        this.checkViews();

        let backContainerEl = selectedUserEl.getElementsByClassName("backContainer")[0];
        backContainerEl.addEventListener("click", () => {
            this.setConversationCardView();
        });
    }

    static setConversationCardView() {
        let conversationCardContainerEl = document.getElementsByClassName("conversationCardContainer")[0];
        conversationCardContainerEl.classList.add("conversationCardContainerFullWidth");
        conversationCardContainerEl.classList.remove("hidden");

        let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
        conversationContainerEl.classList.add("hidden");

        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
        let backContainerEl = selectedUserEl.getElementsByClassName("backContainer")[0];
        backContainerEl.classList.add("hidden");
    }

    static setConversationView() {
        let conversationCardContainerEl = document.getElementsByClassName("conversationCardContainer")[0];
        conversationCardContainerEl.classList.remove("conversationCardContainerFullWidth");
        conversationCardContainerEl.classList.add("hidden");

        let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
        conversationContainerEl.classList.remove("hidden");

        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
        let backContainerEl = selectedUserEl.getElementsByClassName("backContainer")[0];
        backContainerEl.classList.remove("hidden");
    }

    static leaveMobileView() {
        let conversationCardContainerEl = document.getElementsByClassName("conversationCardContainer")[0];
        conversationCardContainerEl.classList.remove("conversationCardContainerFullWidth");
        conversationCardContainerEl.classList.remove("hidden");

        let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
        conversationContainerEl.classList.remove("hidden");

        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];
        let backContainerEl = selectedUserEl.getElementsByClassName("backContainer")[0];
        backContainerEl.classList.add("hidden");
    }

    static logout() {
        let selectedUserEl = document.getElementsByClassName("selectedUser")[0];

        this.currentUser = null;
        this.currentConversationUser = null;
        localStorage.removeItem("chat-pwa-conversation-path");

        selectedUserEl.innerHTML = "<span>SignIn</span>";
        selectedUserEl.replaceWith(selectedUserEl.cloneNode(true)); // remove all listener

        this.checkViews();
    }

    static checkViews(isEvent) {
        this.checkUserSelectionView();

        if (this.currentUser == null) {
            return;
        }

        if (window.innerWidth < this.MOBILE_VIEW_THRESHOLD && (this.VIEW_MODE === 0 || !isEvent)) {
            this.changeToMobileView();
        } else if (window.innerWidth > this.MOBILE_VIEW_THRESHOLD && (this.VIEW_MODE === 1 || !isEvent)) {
            this.changeToDesktopView();
        }
    }

    static checkUserSelectionView() {
        let userSelectionContainerEl = document.getElementsByClassName("userSelectionContainer")[0];
        if (userSelectionContainerEl == null) {
            return;
        }

        if (window.innerWidth < this.MOBILE_VIEW_THRESHOLD) {
            userSelectionContainerEl.style.flexDirection = "column";
        } else {
            userSelectionContainerEl.style.removeProperty("flex-direction");
        }
    }

    static changeToMobileView() {
        this.VIEW_MODE = 1;
        this.setConversationView();
    }

    static changeToDesktopView() {
        this.VIEW_MODE = 0;
        this.leaveMobileView();
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

    static createNavBarContentHTML(username) {
        let html = "<div class='backContainer'>";
        html += "<img src='/images/back.png' class='backIcon' alt='Show conversation overview'>";
        html += "</div>";
        html += this.createUserAvatarHTML(username);
        return html;
    }
}
