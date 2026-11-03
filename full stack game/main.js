import { supabase } from "./supabase.js";
import { currentUser, currentProfile, setCurrentProfile, setCurrentUser, clearCurrentUser } from "./user.js";

const { data, error } = await supabase.auth.getSession();

if (data.session) {
    setCurrentUser(data.session.user);

    const { data: profile, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", currentUser.id)
    .single();

    console.log("User is logged in!");
    if (error) {
        console.log("Error fetching profile:", error.message);
    } else {
        setCurrentProfile(profile)
        console.log("Username:", currentProfile.username);
    }
    //window.location.href = "index.html";
} else {
    console.log("User is not logged in!");
    window.location.href = "signup.html";
}