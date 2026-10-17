// Adressen till vårt publicerade API
const apiUrl = "https://lab4-backend-l388.onrender.com";

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

    // Skickar användaren tillbaka till inloggningssidan
    window.location.href = "index.html";
});

// Kontrollerar att användaren har en giltig JWT-token
async function checkLoginStatus() {
    const token = sessionStorage.getItem("token");

    // Skickar tillbaka användaren om token saknas
    if (!token) {
        window.location.replace("index.html");
        return;
    }

    try {
        // Kontrollerar token mot vår skyddade API-route
        const response = await fetch(`${apiUrl}/api/notes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Tar bort ogiltig eller utgången token
            sessionStorage.removeItem("token");
            window.location.replace("index.html");
            return;
        }

        // Visar sidan först när token har verifierats
        document.querySelector("#notesSection").hidden = false;

    } catch (error) {
        console.error("Kunde inte kontrollera inloggningen:", error);

        // Visar inte skyddat innehåll vid anslutningsfel
        window.location.replace("index.html");
    }
}

// Kontrollerar inloggningen när sidan öppnas
checkLoginStatus();