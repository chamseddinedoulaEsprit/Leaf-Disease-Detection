import React, { useState } from 'react';
import axios from 'axios';

export default function DetectPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Veuillez sélectionner une image.');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError('Erreur lors de la prédiction : ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Détection d'anomalies (maladies des feuilles)</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? 'Analyse en cours...' : 'Analyser'}</button>
      </form>
      {error && <div className="message">{error}</div>}
      {result && (
        <div className="result-box">
          <h3>Résultat</h3>
          <img src={`http://localhost:5000${result.image}`} alt="Feuille analysée" style={{maxWidth: 220, margin: '10px 0'}} />
          <p><b>Maladie détectée :</b> {result.prediction}</p>
          <p><b>Description :</b> {result.description}</p>
          <p><b>Étapes possibles :</b> {result.possible_step}</p>
          <p><b>Supplément conseillé :</b> {result.supplement_name}</p>
          {result.supplement_prod_link && <p><a href={result.supplement_prod_link} target="_blank" rel="noopener noreferrer">Acheter le supplément</a></p>}
        </div>
      )}
    </div>
  );
}