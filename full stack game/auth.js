import { supabase } from "./supabase.js";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

if (signupForm) 
{
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
            window.location.href = "index.html";
        } else {
            message.textContent = "Check your email to confirm your account!";
        }

    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        message.textContent = "Logging in...";

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            message.textContent = error.message;
            return;
        }

        message.textContent = "Login successful!";
        window.location.href = "index.html";
    });
}