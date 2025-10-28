import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { apiPost } from '../api';
import { useState } from 'react';

export default function CreateProfile({ route, navigation }: any) {
  const { token } = route.params;
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [age, setAge] = useState('');

  async function onSubmit() {
    if (!name.trim()) return Alert.alert('Name is required');
    try {
      await apiPost('/profile', token, {
        name: name.trim(),
        year: year.trim() || undefined,
        age: age ? Number(age) : undefined,
      });
      navigation.replace('MainTabs', { token });
    } catch (e:any) {
      Alert.alert('Error', e?.message || 'Failed to create profile');
    }
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Create a profile</Text>

      <Text>Name *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={{ borderWidth:1, borderRadius:8, padding:10 }}
      />

      <Text>Year (optional)</Text>
      <TextInput
        value={year}
        onChangeText={setYear}
        placeholder="e.g. Sophomore / 2026"
        style={{ borderWidth:1, borderRadius:8, padding:10 }}
      />

      <Text>Age (optional)</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="e.g. 22"
        style={{ borderWidth:1, borderRadius:8, padding:10 }}
      />

      <Button title="Continue" onPress={onSubmit} />
    </View>
  );
}
