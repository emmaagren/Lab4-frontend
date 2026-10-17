# Laboration 4 – Frontend

Frontend-webbplats utvecklad med HTML, CSS och JavaScript som en del av Laboration 4 i kursen Backend-baserad webbutveckling vid Mittuniversitetet.

## Beskrivning

Webbplatsen hanterar registrering och inloggning av användare samt personliga anteckningar. Webbplatsen kommunicerar med ett separat backend-API med hjälp av Fetch API.

Vid lyckad inloggning sparas en JSON Web Token (JWT) i webbläsarens sessionStorage. Token används sedan för att komma åt skyddade resurser i webbtjänsten.

## Tekniker

- HTML5
- CSS3
- JavaScript
- Fetch API
- JSON Web Token (JWT)
- sessionStorage

## Installation

1. Klona projektet från GitHub.
2. Öppna projektmappen i Visual Studio Code.
3. Starta `index.html` med exempelvis tillägget Live Server.
4. Registrera ett användarkonto eller logga in med ett befintligt konto.

Webbplatsen kräver att backend-API:et är tillgängligt för att registrering, inloggning och anteckningar ska fungera.

## Funktionalitet

### Registrera användare

På startsidan finns ett formulär där användaren kan skapa ett konto med användarnamn och lösenord.

Uppgifterna skickas till backend-API:et med ett POST-anrop via Fetch API.

### Logga in

Användaren kan logga in med sitt användarnamn och lösenord.

Vid lyckad inloggning returnerar backend-API:et en JWT-token som sparas i sessionStorage.

Användaren skickas sedan vidare till den skyddade undersidan `notes.html`.

### Hämta anteckningar

På den skyddade undersidan kan användaren hämta och visa sina egna anteckningar.

Anteckningarna hämtas från backend-API:et med ett GET-anrop via Fetch API.

JWT-token skickas med i HTTP-headern:

`Authorization: Bearer DIN_TOKEN`

### Skapa anteckning

Användaren kan skapa en ny anteckning genom att ange en rubrik och ett innehåll.

Uppgifterna skickas till backend-API:et med ett POST-anrop via Fetch API.

När anteckningen har sparats uppdateras listan med användarens anteckningar.

### Logga ut

Användaren kan logga ut genom att klicka på knappen "Logga ut".

JWT-token tas då bort från sessionStorage och användaren skickas tillbaka till startsidan.

## Säkerhet

- JWT används för autentisering vid anrop till skyddade resurser.
- JWT-token lagras i webbläsarens sessionStorage.
- Den skyddade undersidan kontrollerar att användaren har en giltig JWT-token.
- Användare utan giltig token skickas tillbaka till inloggningssidan.
- Backend-API:et kontrollerar JWT innan skyddade anteckningar kan hämtas eller skapas.
- Användarnas lösenord lagras inte i frontend.

## Statusmeddelanden

| Händelse | Meddelande |
|---|---|
| Lyckad registrering | Bekräftelse på att kontot skapats |
| Misslyckad registrering | Felmeddelande visas |
| Misslyckad inloggning | Felmeddelande visas |
| Anteckning sparad | Bekräftelse visas |
| Inga anteckningar finns | Information visas |
| Fel vid API-anrop | Felmeddelande visas |

## Testning

Webbplatsen har testats lokalt med Live Server i Visual Studio Code.

Registrering, inloggning, JWT-autentisering, skapande och hämtning av anteckningar samt utloggning har kontrollerats.

Det har även testats att användare utan giltig JWT-token inte kan visa den skyddade undersidan.

## Publicering

Frontend-webbplatsen är publicerad på Netlify.

Webbadress: https://lab4-frontend.netlify.app/

Webbplatsen kommunicerar med backend-API som är publicerat på Render.

Backend-API: https://lab4-backend-l388.onrender.com

Registrering, inloggning, JWT-autentisering samt skapande och hämtning av anteckningar har testats efter publicering.

## Kurs

Backend-baserad webbutveckling - Laboration 4, uppgift 2.

## Skapad av

Emma Ågren student MIUN