/**
 * chat-pwa api
 *
 * fetch option object params:
 * method: "GET", // *GET, POST, PUT, DELETE, etc.
 * mode: "cors", // no-cors, *cors, same-origin
 * cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
 * credentials: "same-origin", // include, *same-origin, omit
 * headers: {
 *      "Content-Type": "application/json",
 *      // 'Content-Type': 'application/x-www-form-urlencoded',
 * },
 * redirect: "follow", // manual, *follow, error
 * referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
 * body: JSON.stringify(data), // body data type must match "Content-Type" header
 */

export class DefaultAPI {
    static serverUrl = "http://localhost:5000";

    static getUsers() {
        return new Promise((resolve, reject) => {
            try {
                fetch(this.serverUrl + "/users", {
                    method: "GET",
                }).then((response) => {
                    resolve(response.json());
                }).catch((err) => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static getConversations() {
        return new Promise((resolve, reject) => {
            try {
                fetch(this.serverUrl + "/conversations", {
                    method: "GET",
                }).then((response) => {
                    resolve(response.json());
                }).catch((err) => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static getMessagesByConversationId(id) {
        return new Promise((resolve, reject) => {
            try {
                fetch(this.serverUrl + "/conversations/" + id + "/messages", {
                    method: "GET",
                }).then((response) => {
                    resolve(response.json());
                }).catch((err) => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static sendMessagesByConversationId(id, data) {
        return new Promise((resolve, reject) => {
            try {
                fetch(this.serverUrl + "/conversations/" + id + "/messages", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then((response) => {
                    resolve(response.json());
                }).catch((err) => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
