/**
 * Includes conversation views and logic
 */

import {DefaultAPI} from "./Api.js";
import {ChatApp} from "./ChatApp.js";

export class ConversationManager {

    static conversations = null;
    static currentConversation = null;

    static createConversations(callback) {
        DefaultAPI
            .getConversations()
            .then(
                (conversations) => {
                    if (conversations == null) {
                        return;
                    }

                    conversations = conversations.filter(item => item.participants.includes(ChatApp.currentUser.username));

                    if (ChatApp.currentConversationUser != null) {
                        if (ChatApp.currentConversationUser.username === ChatApp.currentUser.username) {
                            ChatApp.currentConversationUser = null;
                        }
                    }

                    this.conversations = conversations;
                    this.createConversationCards(callback);
                },
                (error) => {
                    console.log("Selected user has no conversations yet");
                }
            );
    }

    static createConversationCards(callback) {
        let html = "<div class='cardContainer'>";

        let conversationUsers = [];

        for (let i = 0; i < this.conversations.length; i++) {
            let conversation = this.conversations[i];
            if (conversation == null) {
                continue;
            }

            let conversationUsername = conversation.participants.filter((item) => item !== ChatApp.currentUser.username)[0];
            if (conversation.participants.length > 1 && conversationUsername == null) {
                conversationUsername = ChatApp.currentUser.username;
            }

            let conversationUser = ChatApp.users.find((item) => item.username === conversationUsername);
            conversationUsers.push(conversationUser);

            if (ChatApp.currentConversationUser == null) {
                ChatApp.currentConversationUser = conversationUser;
                this.currentConversation = conversation;
            } else if (ChatApp.currentConversationUser.username === conversationUser.username) {
                this.currentConversation = conversation;
            }

            html += this.createConversationCardHTML(conversation, conversationUser);
        }

        html += "</div>";

        let conversationCardContainerEl = document.getElementsByClassName("conversationCardContainer")[0];
        conversationCardContainerEl.innerHTML = html;

        let cardEls = document.getElementsByClassName("card");
        for (let i = 0; i < cardEls.length; i++) {
            cardEls[i].addEventListener('click', () => {
                cardEls[i].classList.add("active");

                for (let j = 0; j < cardEls.length; j++) {
                    if (i === j) {
                        continue;
                    }

                    cardEls[j].classList.remove("active");
                }

                this.currentConversation = this.conversations[i];
                ChatApp.currentConversationUser = conversationUsers[i];

                callback(ChatApp.currentUser, conversationUsers[i]);
            });
        }

        callback(ChatApp.currentUser, ChatApp.currentConversationUser);
    }

    static displayConversation() {
        DefaultAPI
            .getMessagesByConversationId(this.currentConversation.id)
            .then(
                (messages) => {
                    let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
                    conversationContainerEl.innerHTML = this.createConversationHTML(messages);
                },
                (error) => {
                    console.log("No message in this conversation");
                }
            );
    }

    static createConversationCardHTML(conversation, conversationUser) {
        let html;
        if (ChatApp.currentConversationUser.username === conversationUser.username) {
            html = "<div class='card active'>";
        } else {
            html = "<div class='card'>";
        }

        html += "<div class='cardAvatar'>";
        html += ChatApp.createUserAvatarHTML(conversationUser.username);
        html += "</div>";

        html += "<div class='cardInformation'>";
        html += "<span>" + conversationUser.fullname + "</span>";
        html += "<br>";
        html += "<span class='cardSubInformation'>" + conversationUser.username + "</span>";
        html += "</div>";

        html += "</div>";

        return html;
    }

    static createConversationHTML(messages) {
        let html = "<div class='conversation'>";

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            if (message == null) {
                continue;
            }

            if (message.from === ChatApp.currentConversationUser.username) {
                html += "<p class='message friendMessage'>";
            } else {
                html += "<p class='message myMessage'>";
            }

            html += message.message;
            html += "</p>";
        }

        return html;
    }
}
