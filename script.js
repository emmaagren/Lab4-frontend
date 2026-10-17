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
        document.querySelector("#notesSection").hidden = false;

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

// Hämtar element för anteckningar
const loadNotesBtn = document.querySelector("#loadNotesBtn");
const notesList = document.querySelector("#notesList");
const notesMessage = document.querySelector("#notesMessage");


// Hämtar användarens anteckningar från API:et
loadNotesBtn.addEventListener("click", async () => {
    const token = sessionStorage.getItem("token");

    notesList.innerHTML = "";
    notesMessage.textContent = "";

    if (!token) {
        notesMessage.textContent = "Du måste logga in först.";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/notes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            notesMessage.textContent = "Kunde inte hämta anteckningarna.";
            return;
        }

        const notes = await response.json();

        if (notes.length === 0) {
            notesMessage.textContent = "Du har inga anteckningar ännu.";
            return;
        }

        // Visar anteckningarna på sidan
        notes.forEach(note => {
            const li = document.createElement("li");
            const title = document.createElement("strong");
            const content = document.createElement("p");

            title.textContent = note.title;
            content.textContent = note.content;

            li.append(title, content);
            notesList.appendChild(li);
        });

    } catch (error) {
        notesMessage.textContent = "Kunde inte ansluta till servern.";
        console.error(error);
    }
});

// Hämtar formuläret för nya anteckningar
const noteForm = document.querySelector("#noteForm");
const saveNoteMessage = document.querySelector("#saveNoteMessage");

// Hanterar när användaren sparar en anteckning
noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Hämtar användarens JWT-token
    const token = sessionStorage.getItem("token");

    if (!token) {
        saveNoteMessage.textContent = "Du måste logga in först.";
        return;
    }

    // Hämtar värden från formuläret
    const title = document.querySelector("#noteTitle").value.trim();
    const content = document.querySelector("#noteContent").value.trim();

    if (!title || !content) {
        saveNoteMessage.textContent = "Fyll i både rubrik och innehåll.";
        return;
    }

    try {
        // Skickar anteckningen till vårt skyddade API
        const response = await fetch(`${apiUrl}/api/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            saveNoteMessage.textContent = "Kunde inte spara anteckningen.";
            return;
        }

        // Visar bekräftelse och tömmer formuläret
        saveNoteMessage.textContent = "Anteckningen har sparats!";
        noteForm.reset();

        // Uppdaterar listan med anteckningar
        loadNotesBtn.click();

    } catch (error) {
        saveNoteMessage.textContent = "Kunde inte ansluta till servern.";
        console.error(error);
    }
});

// Hämtar utloggningsknappen
const logoutBtn = document.querySelector("#logoutBtn");

// Hanterar utloggning
logoutBtn.addEventListener("click", () => {

    // Tar bort användarens JWT-token
    sessionStorage.removeItem("token");

    // Döljer anteckningssektionen
    document.querySelector("#notesSection").hidden = true;

    // Rensar anteckningar och formulär
    notesList.innerHTML = "";
    noteForm.reset();
    loginForm.reset();

    // Visar meddelande
    message.textContent = "Du har loggat ut!";
    notesMessage.textContent = "";
    saveNoteMessage.textContent = "";
});

// Kontrollerar om användaren redan är inloggad
async function checkLoginStatus() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return;
    }

    try {
        // Kontrollerar att JWT-token fortfarande är giltig
        const response = await fetch(`${apiUrl}/api/notes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Tar bort token om den inte längre är giltig
            sessionStorage.removeItem("token");
            return;
        }

        // Visar anteckningssektionen
        document.querySelector("#notesSection").hidden = false;
        message.textContent = "Du är inloggad!";

    } catch (error) {
        console.error("Kunde inte kontrollera inloggningen:", error);
    }
}

// Kontrollerar inloggningen när sidan öppnas
checkLoginStatus();