import { supabase } from "./supabase.js";

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    message.textContent = "Creating account...";

    const { data, error } = await supabase.auth.signUp({

        email: email,
        password: password,

        options: {
            data: {
                username: username
            }
        }

    });

    if (error) {
        message.textContent = error.message;
        return;
    }

    if (data.session) {
        message.textContent = "Account created successfully!";
    } else {
        message.textContent = "Check your email to confirm your account!";
    }

});