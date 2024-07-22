import { getTokenCookie } from './utils.js';

export function initializeApp(token, userId, onLoginSuccess, username = null, password = null) {
    if (username && password) {
        login(username, password, onLoginSuccess);
    } else {
        const storedToken = getTokenCookie();
        if (storedToken !== "") {
            getUserId(storedToken, onLoginSuccess);
        }
    }
}

function login(username, password, onLoginSuccess) {
    let log = 'https://01.kood.tech/api/auth/signin';

    let http = new XMLHttpRequest();
    http.open('POST', log, true);
    http.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent(username + ":" + password))));
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            let res = JSON.parse(http.responseText);
            if (typeof res === 'string' || res instanceof String) {
                document.cookie = "token=" + res;
                getUserId(res, onLoginSuccess);
            } else {
                document.getElementById("loginError").innerHTML = res.error;
            }
        }
    }
    http.send();
}

function getUserId(token, onLoginSuccess) {
    let idUrl = 'https://01.kood.tech/api/graphql-engine/v1/graphql';

    let http = new XMLHttpRequest();
    http.open('POST', idUrl, true);
    http.setRequestHeader('Authorization', 'Bearer ' + token);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            let res = JSON.parse(http.responseText);
            const userId = res.data.user[0].id;
            onLoginSuccess(token, userId);
        }
    }

    const data = JSON.stringify({
        query: `{
            user {
              id
            }
          }`,
    });

    http.send(data);
}