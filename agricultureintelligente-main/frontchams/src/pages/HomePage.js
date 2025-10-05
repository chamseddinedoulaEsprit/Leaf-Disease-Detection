import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SensorList from '../components/SensorList';

export default function HomePage() {
  const [capteurs, setCapteurs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('home');
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (selectedTab === 'sensors') {
      axios.get('http://localhost:3001/capteurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCapteurs(res.data))
        .catch(err => setMessage('Erreur capteurs: ' + (err.response?.data?.error || err.message)));
    }
  }, [selectedTab, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Supprimer le compte ?')) return;
    axios.delete('http://localhost:3001/user', { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        localStorage.clear();
        navigate('/login');
      })
      .catch(err => setMessage('Erreur suppression: ' + (err.response?.data?.error || err.message)));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    axios.put('http://localhost:3001/user', { mail, mdp }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setMessage('Profil mis à jour !'))
      .catch(err => setMessage('Erreur profil: ' + (err.response?.data?.error || err.message)));
  };

  return (
    <div className="container">
      <div className="navbar">
        <span>Bienvenue {user.nom} {user.prenom}</span>
        <button onClick={handleLogout}>Déconnexion</button>
        <button onClick={handleDeleteAccount} className="danger">Supprimer le compte</button>
      </div>
      <div className="tabs">
        <button onClick={() => setSelectedTab('home')} className={selectedTab==='home' ? 'active' : ''}>Accueil</button>
        <button onClick={() => setSelectedTab('sensors')} className={selectedTab==='sensors' ? 'active' : ''}>Capteurs</button>
        <button onClick={() => setSelectedTab('profile')} className={selectedTab==='profile' ? 'active' : ''}>Profil</button>
        <button onClick={() => setSelectedTab('info')} className={selectedTab==='info' ? 'active' : ''}>À propos</button>
      </div>
      <div className="content">
        {selectedTab === 'home' && (
          <div className="centered">
            <h2>Bienvenue sur l'application d'agriculture intelligente !</h2>
            <p>Surveillez vos capteurs et optimisez votre exploitation.</p>
            <button onClick={() => navigate('/detect')} style={{marginTop: 24, background: '#4E944F', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 17, fontWeight: 'bold', cursor: 'pointer'}}>Détecter une anomalie</button>
          </div>
        )}
        {selectedTab === 'sensors' && (
          <SensorList capteurs={capteurs} />
        )}
        {selectedTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <h3>Modifier le profil</h3>
            <input type="email" placeholder="Nouveau mail" value={mail} onChange={e => setMail(e.target.value)} />
            <input type="password" placeholder="Nouveau mot de passe" value={mdp} onChange={e => setMdp(e.target.value)} />
            <button type="submit">Enregistrer</button>
          </form>
        )}
        {selectedTab === 'info' && (
          <div className="centered">
            <h3>À propos</h3>
            <p>Cette application vous permet de surveiller en temps réel les données de vos capteurs agricoles.<br />Développée pour optimiser la gestion de votre exploitation et améliorer vos rendements.<br />Contact : support@agri-intelligente.com</p>
          </div>
        )}
        <div className="message">{message}</div>
      </div>
    </div>
  );
}