// src/features/documents/DocumentFormScreen.tsx
import { useState } from 'react';
import { View, TextInput, ScrollView, Image } from 'react-native';
import { useDocumentStore } from './documentStore';
import CategoryPicker from './components/CategoryPicker';
import TagInput from './components/TagInput';
import StatusPicker from './components/StatusPicker';

export default function DocumentFormScreen({ route, navigation }) {
  // Pré-remplissage possible depuis l'OCR ou la voix
  const extracted = route.params?.extractedData;
  const imagePath = route.params?.imagePath;

  const [form, setForm] = useState({
    type: 'facture',
    categoryId: null,
    status: 'en_attente',
    amount: extracted?.amount ?? '',
    tva: extracted?.tva ?? '',
    provider: extracted?.provider ?? '',
    documentDate: extracted?.date ?? new Date().toISOString(),
    notes: '',
    tags: [],
  });

  const addDocument = useDocumentStore((s) => s.addDocument);

  const handleSubmit = async () => {
    await addDocument({ ...form, imagePath });
    navigation.navigate('DocumentList');
  };

  return (
    <ScrollView>
      {imagePath && <Image source={{ uri: imagePath }} style={{ height: 200 }} />}

      <TextInput
        placeholder="Fournisseur"
        value={form.provider}
        onChangeText={(v) => setForm({ ...form, provider: v })}
      />
      <TextInput
        placeholder="Montant"
        keyboardType="decimal-pad"
        value={String(form.amount)}
        onChangeText={(v) => setForm({ ...form, amount: v })}
      />
      <TextInput
        placeholder="TVA"
        keyboardType="decimal-pad"
        value={String(form.tva)}
        onChangeText={(v) => setForm({ ...form, tva: v })}
      />

      <CategoryPicker value={form.categoryId} onChange={(id) => setForm({ ...form, categoryId: id })} />
      <StatusPicker value={form.status} onChange={(s) => setForm({ ...form, status: s })} />
      <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

      <TextInput
        placeholder="Notes"
        multiline
        value={form.notes}
        onChangeText={(v) => setForm({ ...form, notes: v })}
      />

      {/* Bouton de validation → handleSubmit */}
    </ScrollView>
  );
}