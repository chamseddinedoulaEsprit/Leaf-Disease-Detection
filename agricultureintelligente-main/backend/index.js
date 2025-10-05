const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Remplace par ton mot de passe MySQL
  database: 'agriculture'
});

// Inscription
app.post('/register', (req, res) => {
  const { nom, prenom, mail, mdp } = req.body;
  const hash = bcrypt.hashSync(mdp, 10);
  db.query(
    'INSERT INTO utilisateur (nom, prenom, mail, mdp) VALUES (?, ?, ?, ?)',
    [nom, prenom, mail, hash],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.sqlMessage });
      res.json({ message: 'Inscription réussie' });
    }
  );
});

// Connexion
app.post('/login', (req, res) => {
  const { mail, mdp } = req.body;
  db.query(
    'SELECT * FROM utilisateur WHERE mail = ?',
    [mail],
    (err, results) => {
      if (err || results.length === 0) return res.status(401).json({ error: 'Utilisateur non trouvé' });
      const user = results[0];
      if (!bcrypt.compareSync(mdp, user.mdp)) return res.status(401).json({ error: 'Mot de passe incorrect' });
      const { id, nom, prenom, mail } = user;
      const token = jwt.sign({ id, mail }, 'SECRET_KEY', { expiresIn: '1h' });
      res.json({ token, user: { id, nom, prenom, mail } });
    }
  );
});

// Middleware pour vérifier le token et récupérer l'id utilisateur
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Modification du profil utilisateur
app.put('/user', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { mail, mdp } = req.body;
  if (!mail && !mdp) return res.status(400).json({ error: 'Aucune donnée à modifier' });
  let fields = [];
  let values = [];
  if (mail) {
    fields.push('mail = ?');
    values.push(mail);
  }
  if (mdp) {
    const hash = bcrypt.hashSync(mdp, 10);
    fields.push('mdp = ?');
    values.push(hash);
  }
  values.push(userId);
  db.query(`UPDATE utilisateur SET ${fields.join(', ')} WHERE id = ?`, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: 'Profil modifié avec succès' });
  });
});

// Suppression du compte utilisateur
app.delete('/user', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query('DELETE FROM utilisateur WHERE id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: 'Compte supprimé avec succès' });
  });
});

// Récupération des valeurs des capteurs (par utilisateur)
app.get('/capteurs', authenticateToken, (req, res) => {
  const userId = req.user.id;
  console.log('Requête capteurs pour utilisateur_id:', userId);
  db.query('SELECT * FROM capteur WHERE utilisateur_id = ? ORDER BY timestamp DESC LIMIT 10', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Route pour consommer l'API Flask de détection
app.post('/detect', async (req, res) => {
  try {
    // On suppose que tu reçois l'image en base64 ou en tant que fichier (multipart/form-data)
    // Ici, exemple avec base64 dans req.body.image
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || !filename) {
      return res.status(400).json({ error: 'Image manquante' });
    }

    // Sauvegarder temporairement l'image sur le serveur Node
    const tempPath = path.join(__dirname, 'temp', filename);
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(tempPath, imageBuffer);

    // Préparer le form-data pour l'API Flask
    const form = new FormData();
    form.append('image', fs.createReadStream(tempPath), filename);

    // Appeler l'API Flask
    const flaskRes = await axios.post('http://localhost:5000/api/predict', form, {
      headers: form.getHeaders(),
    });

    // Supprimer le fichier temporaire
    fs.unlinkSync(tempPath);

    // Retourner la réponse Flask au frontend
    res.json(flaskRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la détection' });
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('API démarrée sur http://0.0.0.0:3001');
});


