import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {Link} from 'expo-router';

// const img = require ("../assets/images/cartoon_mask.png")

export default function index() {
    return (
        //if (colourdetectionph = < 6.5 || > 8.3)
        abnormal()

        //if (colourdetectionph = 7.5)
        //healthy()

        //if (colourdetectionph = 6.5~7.7)
        //slightrisk()
    );
}


export function abnormal() {
    return (
        <View style={styles.container}>
            <Text style={styles.titlerisk}>Abnormal Result!</Text>

            <Image source={require('../assets/images/at_risk.jpg')} style={styles.cartoon_mask}/>
            <Text style = {styles.text}>
                Please visit the nearest doctor at soon as possible!
            </Text>
        </View>
    );
}


export function healthy() {
    return (
        <View style={styles.container}>
            <Text style={styles.titlehealthy}>Healthy!</Text>

            <Image source={require('../assets/images/healthy.jpg')} style={styles.cartoon_mask}/>
            <Text style = {styles.text}>
                Nothing to worry about!
            </Text>
        </View>
    );
}

export function slightrisk() {
    return (
        <View style={styles.container}>
            <Text style={styles.titlecaution}>Slight Risk!</Text>

            <Image source={require('../assets/images/caution.jpg')} style={styles.cartoon_mask}/>
            <Text style = {styles.text}>
                Please monitor your health and consider a medical check-up.
            </Text>
        </View>
    );
}


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
        backgroundColor: '#d3d3d3', // 🔹 Fill color (Change this to your preferred color)
        paddingVertical: 12, // 🔹 Space inside the button (height)
        paddingHorizontal: 20, // 🔹 Space inside the button (width)
        borderRadius: 10, // 🔹 Rounded corners
        borderWidth: 2, // 🔹 Border thickness
        borderColor: '#0056b3', // 🔹 Border color
        alignItems: 'center', // 🔹 Centers text inside the button
        justifyContent: 'center',
        marginBottom: 50, // 🔹 Space below the button
    }
    
    });