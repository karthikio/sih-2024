import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    TextInput,
    Button,
    ActivityIndicator,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
    collection,
    getDoc,
    addDoc,
    onSnapshot,
    serverTimestamp,
    doc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { format, isToday } from "date-fns";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";

const CommunityChat = () => {
    const [chat, setChat] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const user = auth.currentUser;

    // Fetch chat messages
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "CommunityChat"), (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChat(messages.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis())); // Sort by latest
        });
        return unsubscribe;
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim() && !imagePreview) {
            Alert.alert("Error", "Message or image cannot be empty.");
            return;
        }

        setUploading(true); // Start loading

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            let userName = "Anonymous";
            if (userDoc.exists()) {
                userName = userDoc.data().name || "Anonymous";
            }

            const messageData = {
                message,
                userId: user.uid,
                userName,
                timestamp: serverTimestamp(),
            };

            if (imagePreview) {
                const compressedImage = await ImageManipulator.ImageManipulator(
                    imagePreview,
                    [{ resize: { width: 800 } }],
                    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
                );
                const imageName = `images/${Date.now()}_${user.uid}.jpg`;
                const imageRef = ref(storage, imageName);
                const imgResponse = await fetch(compressedImage.uri);
                const imgBlob = await imgResponse.blob();

                await uploadBytes(imageRef, imgBlob);
                const downloadUrl = await getDownloadURL(imageRef);
                messageData.imageUrl = downloadUrl;
            }

            await addDoc(collection(db, "CommunityChat"), messageData);

            // Instantly update chat locally
            setChat((prevChat) => [
                { id: Date.now().toString(), ...messageData, timestamp: new Date() },
                ...prevChat,
            ]);

            setMessage("");
            setImagePreview(null);
            setSheetVisible(false);
        } catch (error) {
            console.error("Error sending message:", error);
            Alert.alert("Error", "Failed to send the message.");
        } finally {
            setUploading(false); // Stop loading
        }
    };

    const handleImageUpload = async () => {
        try {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                Alert.alert(
                    "Permission Denied",
                    "You need to grant permissions to access the library."
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.2,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImagePreview(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Image Picker Error:", error);
            Alert.alert("Error", "Failed to open image picker.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Community Chat</Text>
            <FlatList
                data={chat}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.userName}>{item.userName}</Text>
                        {item.timestamp && (
                            <Text style={styles.timestamp}>
                                {isToday(new Date(item.timestamp.toMillis()))
                                    ? `Today at ${format(new Date(item.timestamp.toMillis()), "h:mm a")}`
                                    : format(new Date(item.timestamp.toMillis()), "MMM d, yyyy 'at' h:mm a")}
                            </Text>
                        )}
                        {item.imageUrl && (
                            <Image source={{ uri: item.imageUrl }} style={styles.image} />
                        )}
                        {item.message && <Text style={styles.message}>{item.message}</Text>}
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setSheetVisible(true)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <Modal visible={sheetVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Message</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            value={message}
                            onChangeText={setMessage}
                            editable={!uploading}
                        />
                        {imagePreview && (
                            <Image
                                source={{ uri: imagePreview }}
                                style={styles.previewImage}
                            />
                        )}
                        {uploading && <ActivityIndicator size="large" color="#007BFF" />}
                        <Button
                            title="Upload Image"
                            onPress={handleImageUpload}
                            disabled={uploading}
                        />
                        <Button
                            title="Send Message"
                            onPress={handleSendMessage}
                            disabled={uploading || (!message.trim() && !imagePreview)}
                        />
                        <Button title="Cancel" onPress={() => setSheetVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f6f7", padding: 20 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
        marginTop: 60,
        marginBottom: 8,
        marginHorizontal: 10,
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    userName: { fontWeight: "bold" },
    message: { marginVertical: 5 },
    image: { width: "100%", height: 200, borderRadius: 5, marginVertical: 5 },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#347928",
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: { color: "#fff", fontSize: 30 },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 10,
    },
    previewImage: { width: "100%", height: 200, marginBottom: 10 },
});

export default CommunityChat;



