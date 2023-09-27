/**
 * Includes chat views and chat logic
 */

class ChatApp {

    static users = null;
    static currentUser = null;

    static async init() {
        await this.displayUserSelection();
    }

    static async displayUserSelection() {
        try {
            this.users = await DefaultAPI.getUsers();

            let mainContainerEl = document.getElementsByClassName("chatContainer")[0];
            mainContainerEl.innerHTML = mainContainerEl.innerHTML + this.createUserSelectionHTML(this.users);

            let imageContainerEls = document.getElementsByClassName('imageContainer');
            for (let i = 0; i < imageContainerEls.length; i++) {
                imageContainerEls[i].addEventListener('click', () => {
                    this.currentUser = this.users[i];

                    let userSelectionContainerEl = document.getElementsByClassName("userSelectionContainer")[0];
                    userSelectionContainerEl.parentElement.removeChild(userSelectionContainerEl);

                    let selectedUserEl = document.getElementsByClassName("selectedUser")[0];

                    let html = "<div class='imageContainer'>";
                    html += "<img src='" + DefaultAPI.serverUrl + "/images/" + this.currentUser.username + ".jpg' alt='avatar'>";
                    html += "</div>";

                    selectedUserEl.innerHTML = html;
                });
            }
        } catch (e) {
            console.error("fetch getUsers failed");
        }
    }

    static createUserSelectionHTML(users) {
        if (users == null || !Array.isArray(users)) {
            console.error("user object invalid\nuser object must be of type array");
            return "No users";
        }

        let html = "<div class='userSelectionContainer flexContainer'>";

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
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
}
