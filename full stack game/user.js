export let currentUser = null;
export let currentProfile = null;

export function setCurrentUser(user) {
    currentUser = user;
}

export function setCurrentProfile(profile) {
    currentProfile = profile;
}

export function clearCurrentUser() {
    currentUser = null;
    currentProfile = null;
}