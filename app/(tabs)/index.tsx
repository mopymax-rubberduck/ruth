
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

// 👇 Ajusta la ruta según tu árbol de carpetas
import { loginWithEmail, registerWithEmail } from '../../src/auth';
import { deleteUser, subscribeToUser, updateUser } from '../../src/db';
import { auth } from '../../src/firebase';
import type { UserProfile } from '../../src/types';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Suscripción al estado de auth y al perfil en Realtime Database
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }
      const stop = subscribeToUser(user.uid, (profile: UserProfile | null) => {
        setCurrentUser(profile);
      });
      return () => stop();
    });
    return () => unsub();
  }, []);

  const canSubmit = useMemo(() => email.length > 0 && password.length >= 6, [email, password]);

  const handleRegister = async () => {
    try {
      const profile = await registerWithEmail(email.trim(), password, displayName.trim() || undefined);
      Alert.alert('Registro exitoso'); // mensaje concreto
      setPassword(''); // limpia contraseña
    } catch (e: any) {
      Alert.alert('Error registrando', `${e?.code ?? ''} - ${e?.message ?? 'Error desconocido'}`);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginWithEmail(email.trim(), password);
      const correo = res.user.email ?? 'usuario';
      Alert.alert(`Bienvenido, ${correo}`);
      setPassword('');
    } catch (e: any) {
      Alert.alert('Error al iniciar sesión', `${e?.code ?? ''} - ${e?.message ?? 'Error desconocido'}`);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.uid, { displayName });
      Alert.alert('Actualizado', 'Nombre actualizado en tiempo real');
    } catch (e: any) {
      Alert.alert('Error al actualizar', `${e?.code ?? ''} - ${e?.message ?? 'Error desconocido'}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      await deleteUser(currentUser.uid);
      Alert.alert('Eliminado', 'Perfil eliminado de Realtime Database');
    } catch (e: any) {
      Alert.alert('Error al eliminar', `${e?.code ?? ''} - ${e?.message ?? 'Error desconocido'}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Realtime DB + Auth (Expo/TS)</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
        />

        <Text style={styles.label}>Contraseña (mín. 6)</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="********"
        />

        <Text style={styles.label}>Nombre para perfil (opcional)</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tu nombre"
        />

        <View style={styles.row}>
          <Button title="Registrar" onPress={handleRegister} disabled={!canSubmit} />
          <View style={{ width: 12 }} />
          <Button title="Login" onPress={handleLogin} disabled={!canSubmit} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Perfil (Realtime)</Text>
        {currentUser ? (
          <>
            <Text>UID: {currentUser.uid}</Text>
            <Text>yyy {currentUser.uid}</Text>
            <Text>Email: {currentUser.email}</Text>
            <Text>Nombre: {currentUser.displayName ?? '(sin nombre)'}</Text>
            <Text>Creado: {new Date(currentUser.createdAt).toLocaleString()}</Text>

            <View style={{ height: 12 }} />
            <View style={styles.row}>
              <Button title="Actualizar nombre" onPress={handleUpdateDisplayName} />
              <View style={{ width: 12 }} />
              <Button title="Eliminar perfil" color="#c62828" onPress={handleDeleteUser} />
            </View>
          </>
        ) : (
          <Text style={{ color: '#666' }}>No hay usuario autenticado.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#111' },
  form: { gap: 8 },
  label: { fontSize: 14, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, color: '#111', backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginTop: 12, backgroundColor: '#fff' },
});
