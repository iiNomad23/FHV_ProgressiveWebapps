/**
 * Entry point
 */

document.addEventListener('DOMContentLoaded', () => {

    DefaultAPI
        .getUsers()
        .then(
            (result) => {
                alert(result);
            },
            (error) => {
                console.error("fetch getUsers failed");
            }
        );

}, false);
