// // import React, { useState } from 'react';
// // import { Text, View, StyleSheet, Image, Alert } from 'react-native';
// // import Button from '../assets/Components/Button';
// // import ImageViewer from '../assets/Components/ImageViewer';
// // import * as ImagePicker from 'expo-image-picker';
// // import axios from 'axios';


// // const PlaceholderImage = require('../assets/images/background-image.png');

// // export default function Index() {
// //     const [selectedImage, setSelectedImage] = useState<string | null>(null);
// //     const [processedImage, setProcessedImage] = useState<string | null>(null);

// //     // Function to select an image from the gallery
// //     const pickImageAsync = async () => {
// //         let result = await ImagePicker.launchImageLibraryAsync({
// //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //             allowsEditing: true,
// //             quality: 1,
// //         });

// //         if (!result.canceled) {
// //             setSelectedImage(result.assets[0].uri);
// //             uploadImage(result.assets[0].uri); // Send image to backend
// //         } else {
// //             Alert.alert('No Image Selected', 'You did not select any image.');
// //         }
// //     };

// //     // Function to upload image to backend
// //     const uploadImage = async (imageUri: string) => {
// //         try {
// //             // Convert image URI to a Blob
// //             const response = await fetch(imageUri);
// //             const blob = await response.blob();

// //             // Create FormData object and append image
// //             const formData = new FormData();
// //             formData.append('file', blob, 'uploaded_image.jpg');

// //             // Send image to backend
// //             const uploadResponse = await axios.post('http://your-backend-url/api/process-image', formData, {
// //                 headers: { 'Content-Type': 'multipart/form-data' },
// //             });

// //             setProcessedImage(uploadResponse.data.imageUrl); // Assuming backend returns processed image URL
// //             console.log('Upload successful:', uploadResponse.data);
// //         } catch (error) {
// //             console.error('Upload error:', error);
// //             Alert.alert('Upload Failed', 'Could not upload image to server.');
// //         }
// //     }; 


// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.imageContainer}>
// //                 <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
// //             </View>

// //             {processedImage && (
// //                 <View style={styles.imageContainer}>
// //                     <Text style={styles.resultText}>Processed Image:</Text>
// //                     <Image source={{ uri: processedImage }} style={styles.resultImage} />
// //                 </View>
// //             )}

// //             <View style={styles.footerContainer}>
// //                 <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
// //                 <Button label="Use this photo" />
// //             </View>
// //         </View>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#25292e',
// //         alignItems: 'center',
// //     },
// //     imageContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     footerContainer: {
// //         flex: 1 / 3,
// //         alignItems: 'center',
// //     },
// //     resultText: {
// //         color: 'white',
// //         fontSize: 16,
// //         marginTop: 10,
// //     },
// //     resultImage: {
// //         width: 200,
// //         height: 200,
// //         marginTop: 10,
// //         borderRadius: 10,
// //     },
// // });



// import React, { useState } from "react";
// import { View, Image, Button, ActivityIndicator, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";

// const PHOTOROOM_API_KEY = "f24e2acae19c85da138960e74ea3db1f2e091208"; // Replace with your actual API key

// export default function BackgroundRemover() {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [processedImage, setProcessedImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Pick Image from Gallery
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//       removeBackground(result.assets[0].uri); // Send image to API
//     } else {
//       Alert.alert("No Image Selected", "Please select an image.");
//     }
//   };

//   // Remove Background via PhotoRoom API
//   const removeBackground = async (imageUri: string) => {
//     if (!imageUri) return;
//     setLoading(true);
  
//     try {
//       // Fetch image and convert to blob
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
  
//       // Ensure the file has the correct format
//       const fileType = blob.type || "image/jpeg"; // Default to jpeg if type is missing
  
//       const formData = new FormData();
//       formData.append("image_file", {
//         uri: imageUri,
//         type: fileType, 
//         name: "image.jpg",
//       });
//       formData.append("format", "png"); // Ensure transparent background output
  
//       console.log("🔹 Sending request to API...");
//       console.log("🔹 FormData content:", formData);
  
//       const uploadResponse = await fetch("https://sdk.photoroom.com/v1/segment", {
//         method: "POST",
//         headers: {
//           "x-api-key": PHOTOROOM_API_KEY, // Ensure API key is valid
//           "Accept": "application/json",
//         },
//         body: formData,
//       });
  
//       console.log("🔹 API Response Status:", uploadResponse.status);
  
//       if (!uploadResponse.ok) {
//         throw new Error(`API Error: ${uploadResponse.status}`);
//       }
  
//       // Convert response to Blob (since the API returns an image)
//       const imageBlob = await uploadResponse.blob();
//       const imageUrl = URL.createObjectURL(imageBlob);
  
//       setProcessedImage(imageUrl); // ✅ Display the processed image
//     } catch (error) {
//       console.error("❌ Error removing background:", error);
//       Alert.alert("Processing Failed", "Make sure the image is valid and try again!");
//     }
  
//     setLoading(false);
//   };
  
//   // Download Processed Image
//   const downloadImage = async () => {
//     if (!processedImage) return;
//     const filename = FileSystem.documentDirectory + "removed_bg.png";
//     await FileSystem.downloadAsync(processedImage, filename);
//     Alert.alert("Success", "Image saved to your device!");
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Pick an Image asdasd" onPress={pickImage} />

//       {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
//       {loading && <ActivityIndicator size="large" color="blue" />}
//       {processedImage && <Image source={{ uri: processedImage }} style={{ width: 200, height: 200 }} />}
//       {processedImage && <Button title="Download Image" onPress={downloadImage} />}
//     </View>
//   );
// }


import React, { useState } from "react";
import { View, Image, Button, ActivityIndicator, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";

const PHOTOROOM_API_KEY = "f24e2acae19c85da138960e74ea3db1f2e091208";

export default function BackgroundRemover() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick Image from Gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      removeBackground(result.assets[0].uri); // Send image to API
    } else {
      Alert.alert("No Image Selected", "Please select an image.");
    }
  };

  // Remove Background via PhotoRoom API using Axios
  const removeBackground = async (imageUri: string) => {
    if (!imageUri) return;
    setLoading(true);

    try {
      console.log("🔹 Converting image to Blob...");
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const formData = new FormData();
      formData.append("image_file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("format", "png");

      console.log("🔹 Sending request to API...");
      
      const response = await axios.post("https://sdk.photoroom.com/v1/segment", formData, {
        headers: {
          "x-api-key": PHOTOROOM_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ API Response:", response.data);

      if (response.data.image_url) {
        setProcessedImage(response.data.image_url); // ✅ Display the processed image
      } else {
        throw new Error("No image_url found in API response");
      }
    } catch (error) {
      console.error("❌ Error removing background:", error);
      Alert.alert("Processing Failed", "Make sure the image is valid and try again!");
    }

    setLoading(false);
  };

  // Download Processed Image to Downloads Folder
  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      const filename = `${FileSystem.documentDirectory}removed_bg.png`;

      // ✅ Download the image to the device storage
      const { uri } = await FileSystem.downloadAsync(processedImage, filename);

      // ✅ Move the file to the Downloads folder
      const downloadsPath =
        Platform.OS === "android"
          ? FileSystem.documentDirectory + "Download/removed_bg.png"
          : FileSystem.documentDirectory + "removed_bg.png"; // For iOS, handled differently

      await FileSystem.moveAsync({
        from: uri,
        to: downloadsPath,
      });

      // ✅ Request permission to save the image to the gallery (for iOS)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(downloadsPath);
        Alert.alert("Success", "Image saved to your Downloads folder!");
      } else {
        Alert.alert("Permission Denied", "Cannot save image without permission.");
      }

      console.log("✅ Image saved to:", downloadsPath);
    } catch (error) {
      console.error("❌ Error downloading image:", error);
      Alert.alert("Download Failed", "Could not save image.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Pick an Image" onPress={pickImage} />



      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      {loading && <ActivityIndicator size="large" color="blue" />}
      {processedImage && <Image source={{ uri: processedImage }} style={{ width: 200, height: 200 }} />}
      {processedImage && <Button title="Download Image" onPress={downloadImage} />}
    </View>
  );
}