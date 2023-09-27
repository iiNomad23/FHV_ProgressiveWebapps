/**
 * Includes conversation views and logic
 */

class ConversationManager {

    static createConversationHeader() {

    }

    static createConversationCards(conversations, users, currentUser) {
        let html = "<div class='cardContainer'>";

        let currentConversationUser = null;
        let currentConversation = null;
        let conversationUsers = [];

        for (let i = 0; i < conversations.length; i++) {
            let conversation = conversations[i];
            if (conversation == null) {
                continue;
            }

            let conversationUsername = conversation.participants.filter((item) => item !== currentUser.username)[0];
            if (conversation.participants.length > 1 && conversationUsername == null) {
                conversationUsername = currentUser.username;
            }

            let conversationUser = users.find((item) => item.username === conversationUsername);
            html += this.createConversationCardHTML(conversation, conversationUser, currentConversationUser == null);

            conversationUsers.push(conversationUser);

            if (currentConversationUser == null) {
                currentConversationUser = conversationUser;
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

                this.createConversation(conversationUsers[i], conversations[i]);
            });
        }

        if (currentConversationUser != null) {
            this.createConversation(currentConversationUser, currentConversation);
        }
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

    static createConversation(currentConversationUser, currentConversation) {
        DefaultAPI
            .getMessagesByConversationId(currentConversation.id)
            .then(
                (messages) => {
                    console.log(messages);
                },
                (error) => {
                    console.log("No message in this conversation");
                }
            );
    }
}