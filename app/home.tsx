import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Modal,
  Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

interface DetailedRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: any[];
  instructions: string;
}

export default function HomeScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);

  // You'll need to sign up for Spoonacular API credentials
  const API_KEY = '451a0c5ab3844b51af60429efc1a4ac1';

  const fetchRecipes = async (search: string = '') => {
    try {
      setError(null);
      const query = search ? `&query=${search}` : '';
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}${query}&number=500`
      );
      const data = await response.json();

      if (data.results) {
        const sortedRecipes = data.results.sort((a: Recipe, b: Recipe) =>
          a.title.localeCompare(b.title)
        );
        setRecipes(sortedRecipes);
      } else {
        setError('No recipes found');
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (recipeId: number) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchRecipes(searchQuery);
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => fetchRecipeDetails(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.cardContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeInfo}>Ready in {item.readyInMinutes} minutes</Text>
        <Text style={styles.recipeInfo}>Servings: {item.servings}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => {
              setSearchQuery('');
              fetchRecipes();
            }}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              fetchRecipes();
            }} style={styles.clearButton}>
              <FontAwesome name="times-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonGap} />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
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
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No recipes found</Text>
          }
        />
      )}

      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRecipe && (
              <>
                <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
                <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
                <Text style={styles.modalText}>Ingredients:</Text>
                {selectedRecipe.extendedIngredients.map((ingredient: any) => (
                  <Text key={ingredient.id} style={styles.modalText}>
                    - {ingredient.original}
                  </Text>
                ))}
                <Text style={styles.modalText}>Instructions:</Text>
                <Text style={styles.modalText}>{selectedRecipe.instructions}</Text>
                <Button title="Close" onPress={() => setSelectedRecipe(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginRight: 10,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    marginLeft: 5,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonGap: {
    width: 10,
  },
});
