import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Drug {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer_name: string;
}

// Create a context for managing click count
const ClickCountContext = createContext<{ count: number; increment: () => void }>({
  count: 0,
  increment: () => {},
});

export function HomeScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const { count, increment } = useContext(ClickCountContext);

  const fetchDrugs = async (search: string = '') => {
    try {
      setError(null);
      const offset = Math.floor(Math.random() * 1000); // Add random offset
      const query = search ? `search=brand_name:${search}` : `limit=50&skip=${offset}`;
      const response = await fetch(
        `https://api.fda.gov/drug/event.json?${query}`
      );
      const data = await response.json();

      if (data.results) {
        const formattedDrugs = data.results.map((item: any) => ({
          id: item.safetyreportid,
          brand_name: item.patient?.drug?.[0]?.openfda?.brand_name?.[0] || 'Unknown',
          generic_name: item.patient?.drug?.[0]?.openfda?.generic_name?.[0] || 'Unknown',
          manufacturer_name: item.patient?.drug?.[0]?.openfda?.manufacturer_name?.[0] || 'Unknown',
        }));
        setDrugs(formattedDrugs);
      } else {
        setError('No drugs found');
      }
    } catch (err) {
      setError('Failed to fetch drug data. Please try again later.');
      console.error('Error fetching drugs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchDrugs(searchQuery);
  };

  const renderDrugItem = ({ item }: { item: Drug }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedDrug(item);
        increment();
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.drugTitle}>{item.brand_name}</Text>
        <Text style={styles.drugInfo}>Generic Name: {item.generic_name}</Text>
        <Text style={styles.drugInfo}>
          Manufacturer: {item.manufacturer_name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search drugs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={drugs}
          renderItem={renderDrugItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No drugs found</Text>
          }
        />
      )}

      <Modal
        visible={!!selectedDrug}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedDrug(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedDrug && (
              <>
                <Text style={styles.modalTitle}>{selectedDrug.brand_name}</Text>
                <Text style={styles.modalText}>
                  Generic Name: {selectedDrug.generic_name}
                </Text>
                <Text style={styles.modalText}>
                  Manufacturer: {selectedDrug.manufacturer_name}
                </Text>
                <Button title="Close" onPress={() => setSelectedDrug(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>{count}</Text>
      </TouchableOpacity>
    </View>
  );
}

interface ClickCountProviderProps {
  children: ReactNode;
}

export const ClickCountProvider: React.FC<ClickCountProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <ClickCountContext.Provider value={{ count, increment }}>
      {children}
    </ClickCountContext.Provider>
  );
};

const App: React.FC = () => (
  <ClickCountProvider>
    <HomeScreen />
  </ClickCountProvider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  errorText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 16,
  },
  list: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#777',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'column',
  },
  drugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  drugInfo: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
