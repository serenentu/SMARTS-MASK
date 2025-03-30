import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useResults } from './ResultsContext';

export default function ResultHistory() {
  const { results } = useResults();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Results History</Text>

      {results.length === 0 ? (
        <Text style={styles.empty}>No results yet.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          )}
        />
      )}

      <Button title="Go Back" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  name: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

