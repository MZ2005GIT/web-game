import { supabase } from "./supabase.js";

export let currentUser = null;
export let currentProfile = null;

export async function initializeUser() {

    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        currentUser = null;
        currentProfile = null;
        return false;
    }

    currentUser = data.session.user;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", currentUser.id)
        .single();

    if (profileError) {
        console.log("Error fetching profile:", profileError.message);
        currentProfile = null;
        return false;
    }

    currentProfile = profile;

    return true;
}

export function clearCurrentUser() {
    currentUser = null;
    currentProfile = null;
}