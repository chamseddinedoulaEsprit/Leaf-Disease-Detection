import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.1.17:3001/login', { mail, mdp });
      navigation.navigate('Home', { token: res.data.token, user: res.data.user });
    } catch (err) {
      setMessage('Erreur: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Connexion</Text>
      <TextInput placeholder="Email" value={mail} onChangeText={setMail} style={styles.input} placeholderTextColor="#4E944F" keyboardType="email-address" />
      <TextInput placeholder="Mot de passe" value={mdp} onChangeText={setMdp} secureTextEntry style={styles.input} placeholderTextColor="#4E944F" />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#E9F5DB' },
  logo: { width: 90, height: 90, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4E944F', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#B4E197', backgroundColor: '#fff', marginBottom: 12, padding: 12, borderRadius: 8, fontSize: 16, color: '#222' },
  button: { backgroundColor: '#4E944F', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginTop: 10, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  message: { color: '#B33030', marginBottom: 10 },
  link: { color: '#4E944F', textDecorationLine: 'underline', marginTop: 10, fontWeight: 'bold' }
}); 