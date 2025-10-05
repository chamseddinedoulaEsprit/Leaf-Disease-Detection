import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen({ route, navigation }) {
  const [capteurs, setCapteurs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [loading, setLoading] = useState(false);
  const token = route?.params?.token;
  const user = route?.params?.user;

  useEffect(() => {
    if (selectedTab === 'sensors') {
      axios.get('http://192.168.1.17:3001/capteurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setCapteurs(res.data);
        })
        .catch(err => {
          alert('Erreur lors de la récupération des capteurs : ' + (err.response?.data?.error || err.message));
        });
    }
  }, [selectedTab]);

  // Fonctions pour le menu
  const handleLogout = () => {
    setMenuVisible(false);
    // Redirige vers la page de login
    if (navigation) navigation.replace('Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {
          setMenuVisible(false);
          // Appel API pour supprimer le compte (à adapter selon ton backend)
          setLoading(true);
          axios.delete('http://192.168.1.17:3001/user', { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
              setLoading(false);
              if (navigation) navigation.replace('Login');
            })
            .catch(err => {
              setLoading(false);
              alert('Erreur lors de la suppression du compte : ' + (err.response?.data?.error || err.message));
            });
        } }
      ]
    );
  };

  const handleOpenProfile = () => {
    setMenuVisible(false);
    setProfileModalVisible(true);
  };

  const handleSaveProfile = () => {
    setLoading(true);
    // Appel API pour modifier le profil (à adapter selon ton backend)
    axios.put('http://192.168.1.17:3001/user', { mail, mdp }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setLoading(false);
        setProfileModalVisible(false);
        alert('Profil mis à jour avec succès !');
      })
      .catch(err => {
        setLoading(false);
        alert('Erreur lors de la modification du profil : ' + (err.response?.data?.error || err.message));
      });
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return (
          <View style={styles.centered}>
            <Image source={require('./assets/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Bienvenue sur l'application d'agriculture intelligente !</Text>
            <Text style={styles.subtitle}>Surveillez vos capteurs et optimisez votre exploitation.</Text>
          </View>
        );
      case 'sensors':
        return (
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            <Text style={styles.title}>Données des Capteurs</Text>
            <FlatList
              data={capteurs}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.label}>🌡️ Température : <Text style={styles.value}>{item.temp}°C</Text></Text>
                  <Text style={styles.label}>💧 Humidité : <Text style={styles.value}>{item.hum}%</Text></Text>
                  <Text style={styles.label}>☀️ Lumière : <Text style={styles.value}>{item.ldr_value}</Text></Text>
                  <Text style={styles.label}>🌱 Sol : <Text style={styles.value}>{item.sol_value}</Text></Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>Aucune donnée capteur disponible.</Text>}
            />
          </View>
        );
      case 'info':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="info" size={60} color="#4E944F" style={{marginBottom: 10}} />
            <Text style={styles.title}>À propos</Text>
            <Text style={styles.infoText}>Cette application vous permet de surveiller en temps réel les données de vos capteurs agricoles.

Développée pour optimiser la gestion de votre exploitation et améliorer vos rendements.

Contact : support@agri-intelligente.com</Text>
          </View>
        );
      case 'camera':
        return (
          <View style={styles.centered}>
            <MaterialIcons name="photo-camera" size={60} color="#4E944F" style={{marginBottom: 10}} />
            <Text style={styles.title}>Caméra</Text>
            <Text style={styles.infoText}>Fonctionnalité à venir : prenez des photos de vos champs ou scannez des QR codes pour ajouter des capteurs.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu en haut */}
      <View style={styles.headerMenu}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <MaterialIcons name="menu" size={32} color="#4E944F" />
        </TouchableOpacity>
        {user && (
          <Text style={styles.userInfo}>{user.nom} {user.prenom}</Text>
        )}
      </View>
      {/* Modal du menu */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenProfile}>
              <MaterialIcons name="person" size={24} color="#4E944F" />
              <Text style={styles.menuItemText}>Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#B33030" />
              <Text style={[styles.menuItemText, { color: '#B33030' }]}>Déconnexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
              <MaterialIcons name="delete" size={24} color="#B33030" />
              <Text style={[styles.menuItemText, { color: '#B33030' }]}>Supprimer le compte</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Modal modification profil */}
      <Modal visible={profileModalVisible} transparent animationType="slide">
        <View style={styles.profileModalOverlay}>
          <View style={styles.profileModal}>
            <Text style={styles.profileTitle}>Modifier le profil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nouveau mail"
              placeholderTextColor="#4E944F"
              value={mail}
              onChangeText={setMail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              placeholderTextColor="#4E944F"
              value={mdp}
              onChangeText={setMdp}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
                <Text style={styles.saveButtonText}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Contenu principal */}
      <View style={{flex: 1, width: '100%'}}>
        {renderContent()}
      </View>
      {/* Barre de navigation en bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} activeOpacity={0.7} onPress={() => setSelectedTab('home')}>
          <MaterialIcons name="home" size={28} color={selectedTab === 'home' ? '#fff' : '#4E944F'} style={{backgroundColor: selectedTab === 'home' ? '#4E944F' : 'transparent', borderRadius: 16, padding: 4}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} activeOpacity={0.7} onPress={() => setSelectedTab('camera')}>
          <MaterialIcons name="photo-camera" size={28} color={selectedTab === 'camera' ? '#fff' : '#4E944F'} style={{backgroundColor: selectedTab === 'camera' ? '#4E944F' : 'transparent', borderRadius: 16, padding: 4}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} activeOpacity={0.7} onPress={() => setSelectedTab('sensors')}>
          <MaterialIcons name="sensors" size={28} color={selectedTab === 'sensors' ? '#fff' : '#4E944F'} style={{backgroundColor: selectedTab === 'sensors' ? '#4E944F' : 'transparent', borderRadius: 16, padding: 4}} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} activeOpacity={0.7} onPress={() => setSelectedTab('info')}>
          <MaterialIcons name="info" size={28} color={selectedTab === 'info' ? '#fff' : '#4E944F'} style={{backgroundColor: selectedTab === 'info' ? '#4E944F' : 'transparent', borderRadius: 16, padding: 4}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E9F5DB', alignItems: 'center', justifyContent: 'flex-end' },
  logo: { width: 90, height: 90, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4E944F', marginBottom: 18, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#222', marginBottom: 10, textAlign: 'center' },
  item: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 14, width: 320, shadowColor: '#4E944F', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  label: { fontSize: 17, color: '#4E944F', fontWeight: 'bold' },
  value: { color: '#222', fontWeight: 'normal' },
  timestamp: { color: '#B4E197', fontSize: 13, marginTop: 6, textAlign: 'right' },
  empty: { color: '#B33030', marginTop: 30, fontSize: 16 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#B4E197',
    position: 'absolute',
    bottom: 0,
    left: 0,
    shadowColor: '#4E944F',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backgroundColor: '#F6FFF2',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 0,
    shadowColor: '#4E944F',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
    minWidth: 48,
    minHeight: 48,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  infoText: { fontSize: 16, color: '#222', textAlign: 'center', marginTop: 10, lineHeight: 24 },
  headerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
  },
  menuButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F6FFF2',
    marginRight: 10,
    shadowColor: '#4E944F',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E944F',
    flex: 1,
    textAlign: 'left',
  },
  userInfo: {
    fontSize: 14,
    color: '#4E944F',
    fontWeight: 'bold',
    marginTop: 2,
    marginLeft: 4,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 60,
    marginRight: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#4E944F',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    minWidth: 220,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 17,
    color: '#4E944F',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: 320,
    shadowColor: '#4E944F',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E944F',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B4E197',
    backgroundColor: '#F6FFF2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#4E944F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#B33030',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 