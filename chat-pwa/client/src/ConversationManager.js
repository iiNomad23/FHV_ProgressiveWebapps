/**
 * Includes conversation views and logic
 */

class ConversationManager {

    static createConversationHeader() {

    }

    static createConversationCards(conversations, users, currentUser) {
        let html = "<div class='cardContainer'>";

        let currentFriendUser = null;
        let currentConversation = null;
        let friendUsers = [];

        for (let i = 0; i < conversations.length; i++) {
            let conversation = conversations[i];
            if (conversation == null) {
                continue;
            }

            let friendUsername = conversation.participants.filter((item) => item !== currentUser.username)[0];
            if (conversation.participants.length > 1 && friendUsername == null) {
                friendUsername = currentUser.username;
            }

            let friendUser = users.find((item) => item.username === friendUsername);
            html += this.createConversationCardHTML(conversation, friendUser, currentFriendUser == null);

            friendUsers.push(friendUser);

            if (currentFriendUser == null) {
                currentFriendUser = friendUser;
                currentConversation = conversation;
            }
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

                this.createConversation(friendUsers[i], conversations[i]);
            });
        }

        if (currentFriendUser != null) {
            this.createConversation(currentFriendUser, currentConversation);
        }
    }

    static createConversation(currentFriendUser, currentConversation) {
        DefaultAPI
            .getMessagesByConversationId(currentConversation.id)
            .then(
                (messages) => {
                    let conversationContainerEl = document.getElementsByClassName("conversationContainer")[0];
                    conversationContainerEl.innerHTML = this.createConversationHTML(currentFriendUser, messages);
                },
                (error) => {
                    console.log("No message in this conversation");
                }
            );
    }

    static createConversationCardHTML(conversation, conversationUser, isActive) {
        let html = "<div class='card " + (isActive ? "active" : "") + "'>";

        html += "<div class='cardAvatar'>";
        html += ChatApp.createNavBarUserAvatarHTML(conversationUser.username);
        html += "</div>";

        html += "<div class='cardInformation'>";
        html += "<span>" + conversationUser.fullname + "</span>";
        html += "<br>";
        html += "<span class='cardSubInformation'>" + conversationUser.username + "</span>";
        html += "</div>";

        html += "</div>";

        return html;
    }

    static createConversationHTML(currentFriendUser, messages) {
        let html = "<div class='conversation'>";

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            if (message == null) {
                continue;
            }

            if (message.from === currentFriendUser.username) {
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