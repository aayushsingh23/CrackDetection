import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function IndexScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      simulateUpload(uri);
    }
  };

  const simulateUpload = async (uri: string) => {
    setUploading(true);
    // Simulate network delay
    setTimeout(() => {
      // Just pretend we're returning a "processed" image
      setProcessedImage(uri); // In reality, this would be a modified version
      setUploading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />

      {uploading && <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }} />}

      {image && <Image source={{ uri: image }} style={styles.image} />}
      {processedImage && (
        <>
          <Text style={styles.label}>Processed Image:</Text>
          <Image source={{ uri: processedImage }} style={styles.image} resizeMode="contain" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
