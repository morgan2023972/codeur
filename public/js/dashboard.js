console.log("📌 Dashboard.js chargé !");

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM prêt, gestion de la déconnexion...");

    const logoutBtn = document.getElementById("logoutBtn");
    const messageBox = document.getElementById("logoutMessage"); // ✅ Vérifier l'existence

    if (!logoutBtn) {
        console.error("❌ ERREUR : Bouton de déconnexion introuvable !");
        return;
    }

    if (!messageBox) {
        console.warn("⚠️ Attention : L'élément #logoutMessage n'existe pas !");
    }

    logoutBtn.addEventListener("click", () => {
        console.log("🚪 Déconnexion en cours...");

        // ✅ Supprimer l'utilisateur du localStorage
        localStorage.removeItem("user");

        // ✅ Afficher le message de déconnexion uniquement si l'élément existe
        if (messageBox) {
            messageBox.innerText = "✅ Vous êtes déconnecté ! Redirection...";
            messageBox.style.color = "green";
            messageBox.style.fontWeight = "bold";
            messageBox.style.textAlign = "center";
            messageBox.style.marginTop = "20px";
        }

        console.log("✅ Déconnexion réussie !");

        // ✅ Rediriger vers `index.html` après 2 secondes
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });
});
