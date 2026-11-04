import { supabase } from "./supabase.js";
import { currentUser, currentProfile, setCurrentProfile, setCurrentUser, clearCurrentUser } from "./user.js";

const { data, error } = await supabase.auth.getSession();

if (data.session) {
    setCurrentUser(data.session.user);

    const { data: profile, error: dataError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", currentUser.id)
    .single();

    console.log("User is logged in!");
    if (dataError) {
        console.log("Error fetching profile:", dataError.message);
    } else {
        setCurrentProfile(profile)
        console.log("Username:", currentProfile.username);
    }
} else {
    console.log("User is not logged in!");
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