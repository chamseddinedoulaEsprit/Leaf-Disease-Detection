import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', { mail, mdp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (err) {
      setMessage('Erreur: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={mail} onChange={e => setMail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={mdp} onChange={e => setMdp(e.target.value)} required />
          <button type="submit">Se connecter</button>
        </form>
        <div className="message">{message}</div>
        <button className="link" onClick={() => navigate('/register')}>Créer un compte</button>
      </div>
    </div>
  );
}