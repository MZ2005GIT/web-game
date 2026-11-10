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

export async function getBestTime()
{
    if (!currentUser) return 0;

    const { data, error } = await supabase
        .from("game_scores")
        .select("best_survival_time")
        .eq("user_id", currentUser.id)
        .maybeSingle();

    if (error) {
        console.log("Error fetching best time:", error.message);
        return 0;
    }

    return data?.best_survival_time ?? 0;
}


export async function saveBestTime(time)
{
    if (!currentUser) return null;

    const newBestTime = Math.floor(time);

    // Fetch the player's existing record
    const { data: existingScore, error } = await supabase
        .from("game_scores")
        .select("best_survival_time")
        .eq("user_id", currentUser.id)
        .maybeSingle();

    if (error) {
        console.log("Error fetching score:", error.message);
        return null;
    }

    // No new record
    if (existingScore && newBestTime <= existingScore.best_survival_time) {
        return existingScore.best_survival_time;
    }

    // Update existing record
    if (existingScore)
    {
        const { error: updateError } = await supabase
            .from("game_scores")
            .update({
                best_survival_time: newBestTime,
                updated_at: new Date().toISOString()
            })
            .eq("user_id", currentUser.id);

        if (updateError) {
            console.log("Error updating score:", updateError.message);
            return null;
        }
    }

    // Insert first record
    else
    {
        const { error: insertError } = await supabase
            .from("game_scores")
            .insert({
                user_id: currentUser.id,
                best_survival_time: newBestTime
            });

        if (insertError) {
            console.log("Error inserting score:", insertError.message);
            return null;
        }
    }

    return newBestTime;
}