const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt'); // 🔒 Sécurisation des mots de passe

const app = express();
const PORT = 3000;

// ✅ Connexion à la base de données
const dbPath = path.join(__dirname, 'users.db'); 
console.log("📂 Base de données utilisée :", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erreur de connexion à SQLite :', err.message);
    } else {
        console.log('✅ Connecté à SQLite (user.db)');
    }
});

// ✅ Création de la table "users" si elle n'existe pas
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('❌ Erreur lors de la création de la table :', err.message);
    } else {
        console.log('✅ Table "users" prête à être utilisée.');
    }
});

// ✅ Middleware pour parser le JSON
app.use(express.json());

// ✅ Servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, '../public')));


// ✅ Route pour afficher tous les utilisateurs
app.get('/users', (req, res) => {
    db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
        if (err) {
            console.error('❌ Erreur lors de la récupération des utilisateurs :', err.message);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
        console.log("🔍 Données récupérées :", rows);
        res.json(rows);
    });
});

// ✅ Route pour l'inscription d'un utilisateur
app.post('/register', async (req, res) => {
    console.log("📩 Données reçues :", req.body); // 🔍 Debugging

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        console.error("❌ Données manquantes !");
        return res.status(400).json({ error: '❌ Tous les champs sont obligatoires.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 🔒 Hachage du mot de passe

        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, email, hashedPassword, role], function (err) {
            if (err) {
                console.error('❌ ERREUR SQLite :', err.message);
                return res.status(500).json({ error: 'Erreur lors de l\'inscription : ' + err.message });
            }
            console.log(`✅ Utilisateur ajouté avec l'ID ${this.lastID}`);
            res.status(201).json({ message: 'Inscription réussie ! 🎉' });
        });

    } catch (err) {
        console.error('❌ ERREUR Node.js :', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// ✅ Route pour la connexion d'un utilisateur
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '❌ Email et mot de passe requis.' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            console.error('❌ Erreur SQLite :', err.message);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        if (!user) {
            return res.status(401).json({ error: '❌ Utilisateur non trouvé.' });
        }

        // Vérification du mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: '❌ Mot de passe incorrect.' });
        }

        res.json({ message: 'Connexion réussie ! 🎉', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
});

// ✅ Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
