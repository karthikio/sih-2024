import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Image, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import {db, auth} from "../firebaseConfig";
import axios from "axios";
import { addDoc, collection } from 'firebase/firestore';


const ChatBot = ({route}) => {
  const { answers = [] } = route.params || {};

  const API_KEY = "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"; // Replace with your actual API key
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State for three images
  const [images, setImages] = useState([null, null, null]);

  // Function to pick image
  const pickImage = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Needed", "Camera roll permissions are required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      // Create a new array with the updated image
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  // Function to remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleChat = async () => {
    // Check if either query or at least one image is present
    const hasImages = images.some(image => image !== null);
    if (!query && !hasImages) {
      Alert.alert("Input Required", "Please enter a query or upload at least one image.");
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64
      const base64Images = await Promise.all(
        images.map(async (imageUri) => {
          if (imageUri) {
            const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
            return `data:image/jpeg;base64,${base64}`;
          }
          return null;
        })
      );

      const combinedQuery = `
      Symptom Questionnaire Responses:
      ${answers.map(a => `${a.question}: ${a.answer}`).join('\n')}

      Additional Context:
      ${query || ''}
    `;

      const payload = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a medical diagnosis assistant. 
            Analyze the provided symptoms, images, and context. 
            Respond ONLY with a JSON object containing:
            - disease_name: string (most likely disease)
            - is_disease_detected: boolean
            - prevention_steps: string[]
            - additional_info: string
            - severity: string
            - remedy: string
            
            If no clear disease is identified, set disease_name to null and is_disease_detected to false.
        
            If the uploaded image not relevant to livestock or body part of livestocks (e.g., contains non-livestock objects or is unrelated), respond with the following JSON:
            {
              "error": "irrelevant_image",
              "message": "The uploaded image does not appear to be related to livestock. Please upload a relevant image."
            }`
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: combinedQuery },
              // Add non-null images to the content
              ...base64Images
                .filter(img => img !== null)
                .map(img => ({
                  type: "image_url", 
                  image_url: { url: img }
                }))
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      };

      const chatResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = JSON.parse(chatResponse.data.choices[0].message.content);
      setResponse(responseData);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "User not logged in.");
        return;
      }

      if (responseData.is_disease_detected) {
      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        latitude,
        longitude,
        cattle: route.params.cattle || "Unknown",
        disease_name: responseData.disease_name,
        is_disease_detected: responseData.is_disease_detected,
        prevention_steps: responseData.prevention_steps,
        additional_info: responseData.additional_info,
        severity: responseData.severity,
        remedy: responseData.remedy,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Report saved successfully.");
    } else {
      Alert.alert("No Disease Detected", "The system did not detect any disease.");
    }


    } catch (error) {
      console.error("Error fetching response:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while fetching the response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="Enter disease or symptoms"
          value={query}
          onChangeText={(text) => setQuery(text)}
          multiline={true}
          numberOfLines={3}
        />

        {/* Image Upload Sections */}
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.imageSection}>
            <View style={styles.imageUploadContainer}>
              <Button 
                title={images[index] ? `Change Image ${index + 1}` : `Upload Image ${index + 1}`} 
                onPress={() => pickImage(index)} 
              />
              
              {images[index] && (
                <TouchableOpacity 
                  onPress={() => removeImage(index)} 
                  style={styles.removeImageButton}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            {images[index] && (
              <Image 
                source={{ uri: images[index] }} 
                style={styles.image} 
              />
            )}
          </View>
        ))}

        <Button 
          title={isLoading ? "Processing..." : "Submit"} 
          onPress={handleChat} 
          disabled={isLoading} 
        />
<View style={styles.responseContainer}>
  <Text style={styles.responseTitle}>AI Assistant Response:</Text>
  <ScrollView
    style={styles.responseScrollView}
    contentContainerStyle={styles.responseScrollViewContent}
  >
    {isLoading ? (
      <Text style={styles.responseText}>Processing your request...</Text>
    ) : response ? (
      typeof response === "object" ? (
        <View>
          {response.is_disease_detected ? (
            <>
              <Text style={styles.responseText}>
                <Text style={{ fontWeight: "bold" }}>Disease Name:</Text> {response.disease_name || "N/A"}
              </Text>
              <Text style={styles.responseText}>
                <Text style={{ fontWeight: "bold" }}>Severity:</Text> {response.severity || "Unknown"}
              </Text>
              <Text style={styles.responseText}>
                <Text style={{ fontWeight: "bold" }}>Remedy:</Text> {response.remedy || "N/A"}
              </Text>
              <Text style={styles.responseText}>
                <Text style={{ fontWeight: "bold" }}>Additional Info:</Text> {response.additional_info || "N/A"}
              </Text>
              {response.prevention_steps && response.prevention_steps.length > 0 && (
                <Text style={styles.responseText}>
                  <Text style={{ fontWeight: "bold" }}>Prevention Steps:</Text>
                  {"\n"}{response.prevention_steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.responseText}>
              The system did not detect any disease. Your livestock appears to be healthy. For more information or concerns, please consult a nearby veterinarian.
            </Text>
          )}
          {response.error && (
            <Text style={styles.responseText}>
              <Text style={{ fontWeight: "bold", color: "red" }}>Error:</Text> {response.error}
              {"\n"}{response.message}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.responseText}>{response}</Text>
      )
    ) : (
      <Text style={styles.responseText}>Your medical AI assistant is ready to help you!</Text>
    )}
  </ScrollView>
</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1f7",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  input: {
    height: 120,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    fontSize: 16,
    color: "#333",
  },
  imageSection: {
    marginBottom: 15,
  },
  imageUploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  removeImageButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  removeImageText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    maxHeight: 250,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#e9ecef',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  responseScrollView: {
    maxHeight: 200,
  },
  responseScrollViewContent: {
    padding: 10,
  },
  responseText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});

export default ChatBot;