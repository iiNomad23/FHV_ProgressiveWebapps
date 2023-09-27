/**
 * Entry point
 */

document.addEventListener('DOMContentLoaded', () => {

    DefaultAPI
        .getUsers()
        .then(
            (users) => {
                let html = createUserHtml(users);
            },
            (error) => {
                console.error("fetch getUsers failed");
            }
        );

}, false);

function createUserHtml(users) {
    if (users == null || !Array.isArray(users)) {
        console.error("user object invalid\nuser object must be of type array");
        return "No users";
    }

    let html = "";
    for (let i = 0; i < users.length; i++) {

    }

    return html;
}
