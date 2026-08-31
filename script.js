

const GOOGLE_SCRIPT_URL = " https://script.google.com/macros/s/AKfycbzjFKwy2Th5nuuuYeyC9SwwZFLTSO3oORCqrJw-VqFNOmPdKYU_0Q4BCAx5hKunjl5cLQ/exec";

const paymentForm = document.getElementById("paymentForm");
const message = document.getElementById("message");

paymentForm.addEventListener("submit", function (event) {

    // Empêche le formulaire de recharger la page
    event.preventDefault();


    // Récupération des valeurs
    const nom = document.getElementById("nom").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const montant = document.getElementById("montant").value;
    const description =
        document.getElementById("description").value.trim();
fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
        nom: nom,
        telephone: telephone,
        montant: montant,
        description: description
    })
})
.then(response => response.json())
.then(data => {

    console.log("Google Sheets :", data);

})
.catch(error => {

    console.error("Erreur Google Sheets :", error);

});


    // Vérification simple
    if (
        nom === "" ||
        telephone === "" ||
        montant === ""
    ) {

        message.textContent =
            "⚠️ Veuillez remplir tous les champs obligatoires.";

        return;
    }


    // Affichage dans la console
    console.log("Nom :", nom);
    console.log("Téléphone :", telephone);
    console.log("Montant :", montant);
    console.log("Description :", description);


    // Message pour l'utilisateur
    message.textContent =
        "✅ Demande reçue. Le paiement sera intégré prochainement.";


    // Réinitialiser le formulaire
    paymentForm.reset();

});

// ======================================================
// WHATSAPP
// ======================================================

const whatsappLink =
    document.getElementById("whatsappLink");


// Numéro au format international
// Sans +, espace ou tiret
const numeroWhatsApp = "25766075117";


// Message qui sera automatiquement préparé
const messageWhatsApp =
    "Bonjour, je voudrais avoir des informations concernant votre service.";


// Création du lien WhatsApp
const lienWhatsApp =
    "https://wa.me/" +
    numeroWhatsApp +
    "?text=" +
    encodeURIComponent(messageWhatsApp);


// Affecter le lien au bouton
whatsappLink.href = lienWhatsApp;


// ======================================================
// METEO DYNAMIQUE
// ======================================================

const btnMeteo =
    document.getElementById("btnMeteo");

const weatherResult =
    document.getElementById("weatherResult");


// ======================================================
// EVENEMENT DU BOUTON METEO
// ======================================================

btnMeteo.addEventListener("click", async function () {


    // Récupérer la ville
    const ville =
        document.getElementById("ville").value.trim();


    // ==================================================
    // VERIFICATION
    // ==================================================

    if (ville === "") {

        weatherResult.innerHTML = `
            <p>
                ⚠️ Veuillez entrer une ville.
            </p>
        `;

        return;
    }


    // Message pendant la recherche
    weatherResult.innerHTML = `
        <p>
            🔄 Recherche de la ville...
        </p>
    `;


    try {


        // ==================================================
        // 1. RECHERCHER LA VILLE
        // ==================================================

        const urlRecherche =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ville)}&count=1&language=fr&format=json`;


        // Envoyer la requête GET
        const responseRecherche =
            await fetch(urlRecherche);


        // Vérifier la réponse HTTP
        if (!responseRecherche.ok) {

            throw new Error(
                "Erreur lors de la recherche de la ville."
            );
        }


        // Transformer la réponse en JSON
        const resultatRecherche =
            await responseRecherche.json();


        console.log(
            "Résultat recherche :",
            resultatRecherche
        );


        // ==================================================
        // 2. VERIFIER SI LA VILLE EXISTE
        // ==================================================

        if (
            !resultatRecherche.results ||
            resultatRecherche.results.length === 0
        ) {

            weatherResult.innerHTML = `
                <p>
                    ❌ Ville introuvable.
                </p>
            `;

            return;
        }


        // ==================================================
        // 3. RECUPERER LA VILLE
        // ==================================================

        const villeTrouvee =
            resultatRecherche.results[0];


        const latitude =
            villeTrouvee.latitude;


        const longitude =
            villeTrouvee.longitude;


        const nomVille =
            villeTrouvee.name;


        const pays =
            villeTrouvee.country;


        // Affichage console
        console.log("Ville :", nomVille);
        console.log("Pays :", pays);
        console.log("Latitude :", latitude);
        console.log("Longitude :", longitude);


        // Message pendant la récupération
        weatherResult.innerHTML = `
            <p>
                🔄 Récupération de la météo...
            </p>
        `;


        // ==================================================
        // 4. APPELER L'API METEO
        // ==================================================

        const urlMeteo =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;


        // Requête GET
        const responseMeteo =
            await fetch(urlMeteo);


        // Vérifier la réponse HTTP
        if (!responseMeteo.ok) {

            throw new Error(
                "Erreur lors de la récupération de la météo."
            );
        }


        // Transformer en JSON
        const donneesMeteo =
            await responseMeteo.json();


        console.log(
            "Données météo :",
            donneesMeteo
        );


        // ==================================================
        // 5. VERIFIER LES DONNEES
        // ==================================================

        if (!donneesMeteo.current) {

            throw new Error(
                "Les données météo sont indisponibles."
            );
        }


        // ==================================================
        // 6. RECUPERER LES DONNEES METEO
        // ==================================================

        const temperature =
            donneesMeteo.current.temperature_2m;


        const vent =
            donneesMeteo.current.wind_speed_10m;


        // ==================================================
        // 7. AFFICHER LA METEO
        // ==================================================

        weatherResult.innerHTML = `

            <div class="weather-content">

                <i class="fa-solid fa-cloud-sun weather-large-icon"></i>

                <h3>
                    Météo de ${nomVille}
                </h3>

                <p>
                    🌍 Pays :
                    <strong>${pays}</strong>
                </p>

                <p>
                    🌡️ Température :
                    <strong>${temperature} °C</strong>
                </p>

                <p>
                    💨 Vent :
                    <strong>${vent} km/h</strong>
                </p>

            </div>

        `;

    }


    // ==================================================
    // GESTION DES ERREURS
    // ==================================================

    catch (error) {

        console.error(
            "Erreur météo :",
            error
        );


        weatherResult.innerHTML = `

            <p>
                ❌ Impossible de récupérer la météo.
            </p>

            <p>
                Vérifiez votre connexion Internet
                et réessayez.
            </p>

        `;
    }

});
// ======================================================
// PAYS - API COUNTRIES.DEV
// ======================================================

const paysSelect = document.getElementById("pays");

async function chargerPays() {

    try {

        const response = await fetch(
            "https://countries.dev/countries"
        );

        if (!response.ok) {
            throw new Error(
                "Erreur HTTP : " + response.status
            );
        }

        const donnees = await response.json();

        console.log("Données reçues :", donnees);

        // Récupérer la liste des pays
        const pays = donnees.data || donnees;

        // Trier par ordre alphabétique
        pays.sort((a, b) =>
            a.name.localeCompare(b.name, "fr")
        );

        // Vider la liste
        paysSelect.innerHTML = "";

        // Première option
        const optionDefaut =
            document.createElement("option");

        optionDefaut.value = "";
        optionDefaut.textContent =
            "Sélectionnez votre pays";

        paysSelect.appendChild(optionDefaut);


        // Ajouter les pays
        pays.forEach(pays => {

            const option =
                document.createElement("option");

            option.value = pays.code;

            option.textContent = pays.name;

            paysSelect.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Erreur API pays :",
            error
        );

        paysSelect.innerHTML = "";

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Impossible de charger les pays";

        paysSelect.appendChild(option);

    }

}


// Charger les pays au démarrage
chargerPays();


