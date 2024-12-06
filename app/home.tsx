import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomeScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Button 
        title="Go to Profile" 
        onPress={() => alert('Profile button clicked')} 
      />
      <Button 
        title="Logout" 
        onPress={() => router.replace('/')} 
        color="#FF6B6B"
      />
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
});
