import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import Button from '../assets/Components/Button';
import ImageViewer from '../assets/Components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


const PlaceholderImage = require('../assets/images/background-image.png');

export default function Index() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);

    // Function to select an image from the gallery
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            uploadImage(result.assets[0].uri); // Send image to backend
        } else {
            Alert.alert('No Image Selected', 'You did not select any image.');
        }
    };

    // Function to upload image to backend
    const uploadImage = async (imageUri: string) => {
        try {
            // Convert image URI to a Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Create FormData object and append image
            const formData = new FormData();
            formData.append('file', blob, 'uploaded_image.jpg');

            // Send image to backend
            const uploadResponse = await axios.post('http://your-backend-url/api/process-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setProcessedImage(uploadResponse.data.imageUrl); // Assuming backend returns processed image URL
            console.log('Upload successful:', uploadResponse.data);
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Failed', 'Could not upload image to server.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            </View>

            {processedImage && (
                <View style={styles.imageContainer}>
                    <Text style={styles.resultText}>Processed Image:</Text>
                    <Image source={{ uri: processedImage }} style={styles.resultImage} />
                </View>
            )}

            <View style={styles.footerContainer}>
                <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
                <Button label="Use this photo" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    resultText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
    resultImage: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
});
