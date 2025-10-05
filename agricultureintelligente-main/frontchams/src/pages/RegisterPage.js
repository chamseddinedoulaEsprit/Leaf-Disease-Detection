import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register', { nom, prenom, mail, mdp });
      setMessage('Inscription réussie !');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMessage('Erreur: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
          <input type="text" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          <input type="email" placeholder="Email" value={mail} onChange={e => setMail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={mdp} onChange={e => setMdp(e.target.value)} required />
          <button type="submit">S'inscrire</button>
        </form>
        <div className="message">{message}</div>
        <button className="link" onClick={() => navigate('/login')}>Déjà inscrit ? Se connecter</button>
      </div>
    </div>
  );
}