console.log("📌 Inscription.js chargé !");

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM entièrement chargé et script prêt !");

    // ✅ Sélection des éléments HTML
    const freelanceBtn = document.getElementById('freelanceBtn');
    const clientBtn = document.getElementById('clientBtn');
    const roleInput = document.getElementById('role');
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // ✅ Vérification des éléments HTML
    if (!freelanceBtn || !clientBtn || !roleInput || !signupForm || !emailInput || !passwordInput) {
        console.error("❌ ERREUR : Certains éléments du formulaire sont introuvables !");
        return;
    }

    // ✅ Empêcher l’auto-remplissage des champs email et password
    setTimeout(() => {
        emailInput.value = "";
        passwordInput.value = "";
        emailInput.removeAttribute("autocomplete");
        passwordInput.removeAttribute("autocomplete");

        // ✅ Changement temporaire des `name` pour contrer l'auto-fill
        emailInput.setAttribute("name", "fake_email");
        passwordInput.setAttribute("name", "fake_password");

        setTimeout(() => {
            emailInput.setAttribute("name", "user_email");
            passwordInput.setAttribute("name", "user_password");
        }, 1000); // Après 1 seconde, on remet les bons noms
    }, 50);

    // ✅ Gestion de la sélection du rôle
    function selectRole(role) {
        roleInput.value = role; // Stocke le rôle sélectionné dans le champ caché

        if (role === 'freelance') {
            freelanceBtn.classList.add('bg-blue-500', 'text-white');
            freelanceBtn.classList.remove('bg-gray-200', 'text-gray-700');

            clientBtn.classList.remove('bg-blue-500', 'text-white');
            clientBtn.classList.add('bg-gray-200', 'text-gray-700');
        } else {
            clientBtn.classList.add('bg-blue-500', 'text-white');
            clientBtn.classList.remove('bg-gray-200', 'text-gray-700');

            freelanceBtn.classList.remove('bg-blue-500', 'text-white');
            freelanceBtn.classList.add('bg-gray-200', 'text-gray-700');
        }
    }

    // ✅ Ajout des écouteurs d’événements pour les boutons de rôle
    freelanceBtn.addEventListener('click', () => selectRole('freelance'));
    clientBtn.addEventListener('click', () => selectRole('client'));

    // ✅ Validation du formulaire
    function validateForm(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 3) {
            errors.push('Le nom doit contenir au moins 3 caractères.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Veuillez entrer un email valide.');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
            errors.push('Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
        }

        if (!data.role || (data.role !== 'freelance' && data.role !== 'client')) {
            errors.push('Veuillez sélectionner un rôle.');
        }

        return errors;
    }

    // ✅ Gestion de la soumission du formulaire
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 🚫 Empêche le rechargement de la page

        // ✅ S'assurer que les `name` des champs sont bien corrects avant validation
        emailInput.setAttribute("name", "user_email");
        passwordInput.setAttribute("name", "user_password");

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);

        // ✅ Correction : Associer les bonnes clés dans l'objet `data`
        data.email = data.user_email;  // Utiliser la bonne clé
        data.password = data.user_password;
        delete data.user_email;
        delete data.user_password;

        console.log("📩 Données saisies après correction :", data);

        // ✅ Validation des données
        const errors = validateForm(data);
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        try {
            // ✅ Envoi des données au serveur
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const message = await response.text();
                alert("✅ " + message); // ✅ Message de succès

                // ✅ Réinitialisation complète du formulaire
                signupForm.reset();
                roleInput.value = '';

                // ✅ Réinitialisation des styles des boutons de rôle
                freelanceBtn.classList.remove('bg-blue-500', 'text-white');
                freelanceBtn.classList.add('bg-gray-200', 'text-gray-700');

                clientBtn.classList.remove('bg-blue-500', 'text-white');
                clientBtn.classList.add('bg-gray-200', 'text-gray-700');

                // ✅ Redirection vers **index.html** après 500ms
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            } else {
                const errorMsg = await response.text();
                console.error('❌ Erreur côté serveur :', errorMsg);
                alert('Erreur lors de l’inscription : ' + errorMsg);
            }
        } catch (error) {
            console.error('❌ Erreur réseau :', error);
            alert('Erreur de connexion avec le serveur.');
        }
    });
});
