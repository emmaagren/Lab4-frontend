// Adressen till vårt publicerade API
const apiUrl = "https://lab4-backend-l388.onrender.com";

// Hämtar formuläret och meddelandefältet
const loginForm = document.querySelector("#loginForm");
const message = document.querySelector("#message");

// Hanterar inloggningen
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch(`${apiUrl}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Inloggningen misslyckades.";
            return;
        }

        // Sparar JWT-token under webbläsarsessionen
        sessionStorage.setItem("token", data.token);

        message.textContent = "Du är nu inloggad!";
    } catch (error) {
        message.textContent = "Kunde inte ansluta till servern.";
        console.error(error);
    }
});

// Hämtar registreringsformuläret och meddelandefältet
const registerForm = document.querySelector("#registerForm");
const registerMessage = document.querySelector("#registerMessage");

// Hanterar registrering av nya användare
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#registerUsername").value.trim();
    const password = document.querySelector("#registerPassword").value;

    try {
        // Skickar användaruppgifterna till vårt API
        const response = await fetch(`${apiUrl}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent =
                data.message || "Registreringen misslyckades.";
            return;
        }

        // Visar ett meddelande och tömmer formuläret
        registerMessage.textContent =
            "Kontot har skapats! Du kan nu logga in.";

        registerForm.reset();

    } catch (error) {
        registerMessage.textContent =
            "Kunde inte ansluta till servern.";

        console.error(error);
    }
});