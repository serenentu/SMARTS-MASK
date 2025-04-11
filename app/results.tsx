import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useResults } from './ResultsContext';
import { classifyHealthState } from './healthUtils';

export default function ResultsScreen() {
    const { results } = useResults();
    const latestResult = results.length > 0 ? results[results.length - 1] : null;
    const healthState = classifyHealthState(latestResult?.pH ?? null);

    // ✅ Debug log
    console.log("Latest Result pH:", latestResult?.pH);
    console.log("Classified Health State:", healthState);

    return renderHealthState(healthState);
}

const renderHealthState = (healthState: string) => {
    switch (healthState) {
        case "Abnormal":
            return <Abnormal />;
        case "Healthy":
            return <Healthy />;
        case "Slight Risk":
            return <SlightRisk />;
        default:
            return <Unknown />;
    }
};

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
        <Text style={styles.text}>Your results are within the healthy range!</Text>
    </View>
);

const SlightRisk = () => (
    <View style={styles.container}>
        <Text style={styles.titlecaution}>Slight Risk!</Text>
        <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask} />
        <Text style={styles.text}>Please monitor your health and consider a medical check-up.</Text>
    </View>
);

const Unknown = () => (
    <View style={styles.container}>
        <Text style={styles.titlecaution}>Unable to classify</Text>
        <Text style={styles.text}>No valid pH data available.</Text>
    </View>
);

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
});
