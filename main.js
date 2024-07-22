import { initializeApp } from './js/initLogin.js';
import { getData } from './js/fetchData.js';
import { logOut } from './js/utils.js';

// Global variables
export let token = "";
export let userId = 0;

export const xpGraphWidth = 480;
export const xpGraphHeight = 240;

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed - LETS GOOOO');

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log(`attempting to log in with username: ${username}`);
        initializeApp(token, userId, onLoginSuccess, username, password);
    });

    document.getElementById('logoutButton').addEventListener('click', logOut);
});

// Callback function to be called after successful login
function onLoginSuccess(newToken, newUserId) {
    console.log('login successful');
    token = newToken;
    userId = newUserId;
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('displayUser').textContent = `User ID: ${userId}`;
    getData(token, userId);
}
