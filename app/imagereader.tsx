import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import Button from '../assets/Components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

// API URL and Key for PhotoRoom API
const URL = 'https://sdk.photoroom.com/v1/segment'; // PhotoRoom API endpoint
const PlaceholderImage = require('../assets/images/background-image.png'); // Placeholder image

// Please replace with your PhotoRoom API Key (sandbox key for testing)
const API_KEY = 'sandbox_fd48f847b70fe7befcc4ace1afd9d7f21b1e48d1';

export const removeBackground = async (imageUri: string) => {
  try {
    // Read file as base64 using Expo FileSystem
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Prepare the image data as a blob or base64 directly
    const formData = new FormData();
    formData.append('image_file', {
      uri: imageUri,
      name: 'image.png',
      type: 'image/png',
    } as any); // explicitly typed for React Native compatibility

    // Send the request to PhotoRoom API
    const apiResponse = await fetch(URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    console.log('API Response:', responseData);

    return responseData.result_b64;
  } catch (e) {
    console.error('Error processing image:', e);
    Alert.alert('Error', e.message || 'Unknown error occurred');
    return null;
  }
};

// React Native component for the app
export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined); // State for selected image URI
  const [processedImage, setProcessedImage] = useState<string | undefined>(undefined); // State for processed image with background removed

  // Function to pick an image from the gallery
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only image selection
      allowsEditing: false, // Allow editing of the image (optional)
      quality: 1, // Set image quality (1 = highest)
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image URI
      processImage(result.assets[0].uri); // Process the selected image to remove the background
    } else {
      Alert.alert('No Image Selected', 'You did not select any image.'); // Alert if no image is selected
    }
  };

  // Function to process the selected image by removing its background
  const processImage = async (imageUri: string) => {
    const bgRemovedImage = await removeBackground(imageUri); // Call removeBackground to process the image
    if (bgRemovedImage) {
      setProcessedImage(`data:image/png;base64,${bgRemovedImage}`); // Set the processed image in base64 format
    } else {
      Alert.alert('Processing Failed', 'Could not remove background.'); // Alert if processing fails
    }
  };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Show the placeholder or the processed image */}
        {!processedImage ? (
          <Image source={PlaceholderImage} style={styles.resultImage} /> // Show the placeholder image
        ) : (
          <Image source={{ uri: processedImage }} style={styles.resultImage} /> // Show the processed image after background removal
        )}
      </View>

      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button theme="primary" label="See Results" onPress={() => router.push('/results')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center', // Center all content
  },
  imageContainer: {
    flex: 1,
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center', // Center the image
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center', // Center the footer content
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center', // Center the result text
  },
  resultImage: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 10, // Rounded corners for the result image
  },
});
