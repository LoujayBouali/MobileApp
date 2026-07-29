import { useEffect } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { useDocumentStore } from './documentStore';
import DocumentCard from './components/DocumentCard';
import FilterBar from '../../features/search/FilterBar';

export default function DocumentListScreen({ navigation }) {
  const { documents, loadDocuments, setFilters, isLoading } = useDocumentStore();

  useEffect(() => { loadDocuments(); }, []);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Rechercher (fournisseur, montant, note...)"
        onChangeText={(text) => setFilters({ searchText: text })}
      />
      <FilterBar onApply={setFilters} />
      <FlatList
        data={documents}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() => navigation.navigate('DocumentDetail', { id: item.id })}
          />
        )}
        refreshing={isLoading}
        onRefresh={loadDocuments}
      />
    </View>
  );
}