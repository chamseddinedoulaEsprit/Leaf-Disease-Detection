import React from 'react';

export default function SensorList({ capteurs }) {
  if (!capteurs.length) return <div>Aucune donnée capteur disponible.</div>;
  return (
    <table className="sensor-table">
      <thead>
        <tr>
          <th>Température (°C)</th>
          <th>Humidité (%)</th>
          <th>Lumière</th>
          <th>Sol</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {capteurs.map(item => (
          <tr key={item.id}>
            <td>{item.temp}</td>
            <td>{item.hum}</td>
            <td>{item.ldr_value}</td>
            <td>{item.sol_value}</td>
            <td>{item.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}