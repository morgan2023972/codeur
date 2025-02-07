console.log("📌 Connexion.js chargé !");

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM entièrement chargé et script prêt !");

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.createElement("p"); // ✅ Message de retour (succès/erreur)
    loginMessage.classList.add("text-center", "mt-4", "font-semibold");
    loginForm.appendChild(loginMessage); // Ajoute le message sous le bouton de connexion

    if (!loginForm || !emailInput || !passwordInput) {
        console.error("❌ ERREUR : Certains éléments du formulaire sont introuvables !");
        return;
    }

    // ✅ Vérifier si l'utilisateur est encore connecté et le rediriger vers le dashboard
    const user = localStorage.getItem("user");
    if (user) {
        console.log("✅ Utilisateur déjà connecté, redirection vers le tableau de bord...");
        window.location.href = "dashboard.html";
        return;
    }

    // ✅ Empêcher l’auto-remplissage des champs et vider les anciennes valeurs
    setTimeout(() => {
        if (emailInput && passwordInput) {
            emailInput.value = "";
            passwordInput.value = "";
            emailInput.setAttribute("autocomplete", "off");
            passwordInput.setAttribute("autocomplete", "new-password");

            // ✅ Changement temporaire des `name` pour tromper le navigateur
            emailInput.setAttribute("name", "fake_email");
            passwordInput.setAttribute("name", "fake_password");

            setTimeout(() => {
                emailInput.setAttribute("name", "user_email");
                passwordInput.setAttribute("name", "user_password");
            }, 1000);
        }
    }, 50);

    // ✅ Gestion de la soumission du formulaire
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // 🚫 Empêche le rechargement de la page

        // ✅ Vérification que les `name` sont corrects avant validation
        emailInput.setAttribute("name", "user_email");
        passwordInput.setAttribute("name", "user_password");

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData);

        // ✅ Correction : Associer les bonnes clés dans l'objet `data`
        data.email = data.user_email;
        data.password = data.user_password;
        delete data.user_email;
        delete data.user_password;

        console.log("📩 Données envoyées après correction :", data);

        if (!data.email || !data.password) {
            loginMessage.innerText = "❌ Veuillez remplir tous les champs.";
            loginMessage.classList.add("text-red-500");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include" // ✅ Important si cookies JWT
            });

            const result = await response.json();
            console.log("📩 Réponse du serveur :", result);

            if (response.ok) {
                loginMessage.innerText = "✅ Connexion réussie !";
                loginMessage.classList.remove("text-red-500");
                loginMessage.classList.add("text-green-500");

                // ✅ Stocker l'utilisateur et rediriger vers le tableau de bord
                localStorage.setItem("user", JSON.stringify(result.user));
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                loginMessage.innerText = "❌ " + (result.error || "Identifiants incorrects.");
                loginMessage.classList.add("text-red-500");
            }
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
            loginMessage.innerText = "❌ Une erreur est survenue.";
            loginMessage.classList.add("text-red-500");
        }
    });
});
