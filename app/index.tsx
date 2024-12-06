import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const [username, setUsername] = useState('');
  const [username1, setUsername1] = useState('Nehan');
  const router = useRouter();

  const handleLogin = () => {
    if (username==username1) {
      router.push(`/home?username=${username}`); // Navigate to HomeScreen
    } else {
      alert('Please enter a valid username');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthcare App Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Regiiiiisteeeer" onPress={() => router.push('/screens/RegisterScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20 
  },
  input: { 
    width: '80%', 
    borderWidth: 1, 
    padding: 10, 
    marginVertical: 10,
    borderRadius: 5
  },
});
