import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function IndexScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('Media permission is required!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await uploadImage(uri);
    } else {
      console.log('Image selection cancelled.');
    }
  };
const uploadImage = async (uri: string) => {
  try {
    setUploading(true); // show loader

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    // Replace this with your actual backend URL
    const response = await axios.post('https://your-backend-url.com/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },git 
    });
    if (response.data && response.data.processedImageUrl) {
      setProcessedImage(response.data.processedImageUrl); // This updates UI to show backend image
    } else {
      alert('No processed image URL returned from backend');
    }
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Something went wrong while uploading.');
  } finally {
    setUploading(false); // hide loader
  }
};

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Crack Detection</Text>
      </View>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        {uploading && <ActivityIndicator size="large" color="yellow" style={{ margin: 20 }} />}

        {image && <Image source={{ uri: image }} style={styles.image} />}

        {processedImage && (
          <>
            <Text style={styles.label}>Processed Image:</Text>
            <Image source={{ uri: processedImage }} style={styles.image} resizeMode="contain" />
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Contact Us @ team_crackers@gmail.com</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Times New Roman',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'yellow',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: 'yellow',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'left',
  },
});
