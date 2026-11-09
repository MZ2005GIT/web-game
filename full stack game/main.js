import { supabase } from "./supabase.js";
import { initializeUser, currentUser, currentProfile, clearCurrentUser } from "./user.js";

const loggedIn = await initializeUser();

if (!loggedIn) {
    window.location.href = "signup.html";
}

const logoutButton = document.getElementById("logoutButton");
const gameButton = document.getElementById("gameButton");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log("Logout error:", error.message);
            return;
        }

        clearCurrentUser();

        console.log("Logged out successfully!");

        window.location.href = "login.html";

    });
}

if (gameButton) {
    gameButton.addEventListener("click", async () => {

        if (currentProfile) {
            window.location.href = "game.html";
        } else {
            console.log("Error fetching profile:", error.message);
        }
    })
}