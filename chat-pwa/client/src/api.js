/**
 * api
 */

class DefaultAPI {
    static serverUrl = "http://localhost:5000";
    Websocket = new WebSocket()

    static getUsers() {
        return new Promise((resolve, reject) => {
            try {
                fetch(this.serverUrl + "/users", {
                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                    // mode: "cors", // no-cors, *cors, same-origin
                    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    // headers: {
                    //     "Content-Type": "application/json",
                    //     // 'Content-Type': 'application/x-www-form-urlencoded',
                    // },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    // body: JSON.stringify(data), // body data type must match "Content-Type" header
                }).then((response) => {
                    resolve(response.json());
                });
            } catch (e) {
                reject();
            }
        });
    }
}

function getUsers() {

}
