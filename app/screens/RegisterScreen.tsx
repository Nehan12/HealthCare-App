import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFormValidation } from '../hooks/useFormValidation';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    gender: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const { errors, isValid } = useFormValidation(formData);
  const router = useRouter();

  const handleRegister = () => {
    if (!isValid) {
      // Show first error message
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return;
    }

    // Add registration logic here
    console.log('Registration data:', formData);
    router.push('/');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderInput = (
    field: keyof typeof formData,
    placeholder: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'numeric' | 'email-address';
      autoCapitalize?: 'none' | 'sentences';
    } = {}
  ) => (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, errors[field] ? styles.inputError : null]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        {...options}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        <View style={styles.inputContainer}>
          {renderInput('name', 'Full Name')}

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              {renderInput('age', 'Age', { keyboardType: 'numeric' })}
            </View>
            <View style={styles.halfInputContainer}>
              {renderInput('weight', 'Weight (kg)', { keyboardType: 'numeric' })}
            </View>
          </View>

          {renderInput('gender', 'Gender (Male/Female)')}
          {renderInput('email', 'Email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
          {renderInput('username', 'Username', { autoCapitalize: 'none' })}
          {renderInput('password', 'Password', { secureTextEntry: true })}
          {renderInput('confirmPassword', 'Confirm Password', { secureTextEntry: true })}

          <TouchableOpacity 
            style={[styles.registerButton, !isValid && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={!isValid}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    width: '48%',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
