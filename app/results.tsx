import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Original classifyHealthState function
export const classifyHealthState = (pH) => {
  if (pH <= 7.4 || pH > 8.6) return "Abnormal";
  if (pH > 7.4 && pH <= 8.5) return "Healthy";
  if (pH > 6.9 && pH <= 7.4) return "Slight Risk";
  if (pH > 8.6 && pH <= 9.0) return "Slight Risk";
  return "Unknown";
};

// Original ResultsScreen Function
export default function ResultsScreen() {
    const [pH, setPH] = useState(9);

    // Determine the state based on pH value
    const healthState = classifyHealthState(pH);

    return renderHealthState(healthState);
}

// 🔹 Function to Render UI Based on Health State
const renderHealthState = (healthState) => {
    switch (healthState) {
        case "Abnormal":
            return <Abnormal />;
        case "Healthy":
            return <Healthy />;
        case "Slight Risk":
            return <SlightRisk />;
    }
};

// Original Components
const Abnormal = () => (
    <View style={styles.container}>
        <Text style={styles.titlerisk}>Abnormal Result!</Text>
        <Image source={require('../assets/images/at_risk.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>Please visit the nearest doctor as soon as possible!</Text>
    </View>
);

const Healthy = () => (
    <View style={styles.container}>
        <Text style={styles.titlehealthy}>Healthy!</Text>
        <Image source={require('../assets/images/healthy.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>Nothing to worry about!</Text>
    </View>
);

const SlightRisk = () => (
    <View style={styles.container}>
        <Text style={styles.titlecaution}>Slight Risk!</Text>
        <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>Please monitor your health and consider a medical check-up.</Text>
    </View>
);

// 🔹 NEW FUNCTIONALITY ADDED
export const FilteredResults = () => {
    const { message, pH } = useLocalSearchParams();
    const router = useRouter();
    const parsedPH = pH ? parseFloat(pH as string) : null;

    // Mock data for results. Replace this with actual data source.
    const resultsData = [
        { id: 1, name: 'Result 1', message: 'Example Message 1', pH: 7.5 },
        { id: 2, name: 'Result 2', message: 'Example Message 2', pH: 6.5 },
        { id: 3, name: 'Result 3', message: 'Example Message 1', pH: 7.0 },
    ];

    // Filter results based on message and pH
    const filteredResults = resultsData.filter(
        (result) =>
            result.message === message && (parsedPH !== null ? result.pH === parsedPH : true)
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filtered Results</Text>
            {filteredResults.length > 0 ? (
                <FlatList
                    data={filteredResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() =>
                                router.push({
                                    pathname: '/result_detail',
                                    params: {
                                        name: item.name,
                                        message: item.message,
                                        pH: item.pH,
                                    },
                                })
                            }
                        >
                            <Text style={styles.resultText}>Name: {item.name}</Text>
                            <Text style={styles.resultText}>Message: {item.message}</Text>
                            <Text style={styles.resultText}>pH: {item.pH}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noResults}>No results found</Text>
            )}
        </View>
    );
};

// Styles (unchanged)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 50,
    },
    titlerisk: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#ff0000',
    },
    titlehealthy: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#00ab41',
    },
    titlecaution: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#FFDE21',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        justifyContent: 'center',
        color: '#000000',
    },
    cartoon_mask: {
        width: 380,
        height: 380,
        resizeMode: 'contain',
        marginTop: 0,
    },
    ntu_logo: {
        width: 220,
        height: 140,
        marginTop: 0,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#d3d3d3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0056b3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    resultText: {
        fontSize: 16,
    },
    noResults: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});
