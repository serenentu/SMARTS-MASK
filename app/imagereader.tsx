// import React, { useState } from 'react';
// import { Text, View, StyleSheet, Image, Alert } from 'react-native';
// import Button from '../assets/Components/Button';
// import ImageViewer from '../assets/Components/ImageViewer';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

// // Use your local IP address instead of 'localhost'
// const URL = 'https://sdk.photoroom.com/v1/segment';
// const PlaceholderImage = require('../assets/images/background-image.png');

// // API Key for PhotoRoom (sandbox)
// const API_KEY = 'sandbox_fd48f847b70fe7befcc4ace1afd9d7f21b1e48d1';

// export const removeBackground = async (imageUri: string) => {
//   try {
//     const response = await fetch(imageUri); // Get the image as a blob
//     const blob = await response.blob();

//     // Prepare form data to send the image
//     const formData = new FormData();
//     formData.append('image_file', blob, 'image.png');

//     // Send request to the PhotoRoom API
//     const apiResponse = await fetch(URL, {
//       method: 'POST',
//       headers: {
//         'x-api-key': API_KEY,
//         Accept: 'application/json',
//       },
//       body: formData,
//     });

//     if (!apiResponse.ok) {
//       throw new Error(`API request failed with status ${apiResponse.status}`);
//     }

//     const responseData = await apiResponse.json();
//     console.log('API Response:', responseData);

//     return responseData.result_b64; // Return the base64 image result
//   } catch (e) {
//     console.error('Error processing image:', e);
//     Alert.alert('Error', e.message || 'Unknown error occurred');
//     return null;
//   }
// };

// export default function Index() {
//   const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
//   const [processedImage, setProcessedImage] = useState<string | undefined>(undefined);

//   // Pick image from the gallery
//   const pickImageAsync = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//       processImage(result.assets[0].uri); // Process the selected image
//     } else {
//       Alert.alert('No Image Selected', 'You did not select any image.');
//     }
//   };

//   // Process the image by removing the background
//   const processImage = async (imageUri: string) => {
//     const bgRemovedImage = await removeBackground(imageUri);
//     if (bgRemovedImage) {
//       setProcessedImage(`data:image/png;base64,${bgRemovedImage}`);
//     } else {
//       Alert.alert('Processing Failed', 'Could not remove background.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.imageContainer}>
//         <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
//       </View>

//       <View style={styles.resultContainer}>
//         {processedImage && <Image source={{ uri: processedImage }} style={styles.resultImage} />}
//       </View>

//       <View style={styles.footerContainer}>
//         <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#25292e',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footerContainer: {
//     flex: 1 / 3,
//     alignItems: 'center',
//   },
//   resultContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   resultImage: {
//     width: 200,
//     height: 200,
//     marginTop: 10,
//     borderRadius: 10,
//   },
// });

import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import Button from '../assets/Components/Button';
import ImageViewer from '../assets/Components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Link, useRouter } from 'expo-router';

// API URL and Key for PhotoRoom API
const URL = 'https://sdk.photoroom.com/v1/segment'; // PhotoRoom API endpoint
const PlaceholderImage = require('../assets/images/background-image.png'); // Placeholder image

// Please replace with your PhotoRoom API Key (sandbox key for testing)
const API_KEY = 'sandbox_fd48f847b70fe7befcc4ace1afd9d7f21b1e48d1';

// Function to remove background using PhotoRoom API
export const removeBackground = async (imageUri: string) => {
  try {
    const response = await fetch(imageUri); // Fetch image as a blob
    const blob = await response.blob(); // Convert the image to a Blob

    // Create a FormData object and append the image to it
    const formData = new FormData();
    formData.append('image_file', blob, 'image.png'); // Add image as 'image_file'

    // Send POST request to PhotoRoom API
    const apiResponse = await fetch(URL, {
      method: 'POST',
      headers: {
        'x-api-key': 'sandbox_fd48f847b70fe7befcc4ace1afd9d7f21b1e48d1', // Add your API key in the header
        Accept: 'application/json', // Accept JSON response
      },
      body: formData, // Send the image form data in the request body
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json(); // Parse the JSON response
    console.log('API Response:', responseData);

    return responseData.result_b64; // Return the base64 image result
  } catch (e) {
    console.error('Error processing image:', e);
    Alert.alert('Error', e.message || 'Unknown error occurred'); // Alert on error
    return null; // Return null if any error occurs
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
      allowsEditing: true, // Allow editing of the image (optional)
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
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>

      <View style={styles.resultContainer}>
        {/* Display the processed image if it exists */}
        {processedImage && <Image source={{ uri: processedImage }} style={styles.resultImage} />}
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
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10, // Rounded corners for the result image
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
