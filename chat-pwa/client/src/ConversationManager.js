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
                    if (conversationContainerEl.innerHTML === "") {
                        conversationContainerEl.innerHTML = this.createConversationHTML();
                        this.setMessageInputEvents();
                    } else {
                        let conversationEl = document.getElementsByClassName("conversation")[0];
                        conversationEl.innerHTML = "";
                    }

                    this.appendMessages(messages);
                },
                (error) => {
                    let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
                    if (conversationContainerEl.innerHTML === "") {
                        conversationContainerEl.innerHTML = this.createConversationHTML();
                        this.setMessageInputEvents();
                    } else {
                        let conversationEl = document.getElementsByClassName("conversation")[0];
                        conversationEl.innerHTML = "<span>No conversation with this person stored</span>";
                    }
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

    static createConversationHTML() {
        let html = "<div class='conversations'>";
        html += "<div class='conversation'>";
        html += "</div>";
        html += "</div>";

        html += "<div class='messageInputContainer'>";
        html += "<input type='text' class='messageInput' placeholder='Message...'>";
        html += "<img src='/images/send.png' class='sendIcon' alt='Send Message'>"
        html += "</div>";

        return html;
    }

    static handleSendMessage(message) {
        let messageObj = {
            from: ChatApp.currentUser.username,
            message: message
        }

        this.appendMessages([messageObj]);

        DefaultAPI.sendMessagesByConversationId(this.currentConversation.id, messageObj)
            .then(
                (result) => {
                    console.log("successfully stored message");
                },
                (err) => {
                    console.log("error sending message");
                }
            );
    }

    static setMessageInputEvents() {
        let messageInputEl = document.getElementsByClassName("messageInput")[0];
        messageInputEl.addEventListener("keyup", (event) => {
            if (this.currentConversation.id == null || messageInputEl.value == null || messageInputEl.value === "") {
                return;
            }

            if (event.key === "Enter") {
                this.handleSendMessage(messageInputEl.value);
                messageInputEl.value = "";
            }
        });

        let sendIconEl = document.getElementsByClassName("sendIcon")[0];
        sendIconEl.addEventListener("click", (event) => {
            if (this.currentConversation.id == null || messageInputEl.value == null || messageInputEl.value === "") {
                return;
            }

            this.handleSendMessage(messageInputEl.value);
            messageInputEl.value = "";
        });
    }

    static appendMessages(messageObjs) {
        let conversationEl = document.getElementsByClassName("conversation")[0];
        let html = "";

        messageObjs = messageObjs ?? [];
        for (let i = 0; i < messageObjs.length; i++) {
            let messageObj = messageObjs[i];
            if (messageObj == null) {
                continue;
            }

            if (messageObj.from === ChatApp.currentConversationUser.username) {
                html += "<p class='message friendMessage'>";
            } else {
                html += "<p class='message myMessage'>";
            }

            html += messageObj.message;
            html += "</p>";
        }

        conversationEl.innerHTML += html;
    }
}
