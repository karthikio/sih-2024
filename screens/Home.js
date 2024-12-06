// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import * as Location from "expo-location";
// import axios from "axios";

// const Home = ({navigation}) => {
//   const [location, setLocation] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_KEY = ""; // Replace with a valid OpenWeather API key

//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         setLoading(true); // Ensure loading starts immediately
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setLoading(false);
//           return alert("Permission to access location was denied.");
//         }
  
//         const userLocation = await Location.getCurrentPositionAsync({});
//         if (!userLocation) {
//           setLoading(false);
//           return alert("Unable to fetch location. Please try again.");
//         }
//         setLocation(userLocation);
  
//         const { latitude, longitude } = userLocation.coords;
//         const weatherResponse = await axios.get(
//           `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
//         );
//         setWeather(weatherResponse.data);
//       } catch (error) {
//         console.error(
//           "Error fetching weather:",
//           error.response ? error.response.data : error.message
//         );
//         alert("Error fetching weather data. Please try again.");
//       } finally {
//         setLoading(false); 
//       }
//     };
  
//     fetchWeather();
//   }, []);


//   const detectOnPress = () => {

//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContent}>
//       {/* App logo */}
//       <View style={styles.header}>
//         <Text style={styles.appTitle}>GreenEye</Text>
//         <Image
//           source={require("../assets/icons/logo.png")} // Replace with your logo path
//           style={styles.logo}
//         />
//       </View>

//       {/* Weather Card */}
//       <View style={styles.weatherCard}>
//         {loading ? (
//           // Loading Indicator inside the weather card
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="small" color="#333333" />
//             <Text>Loading</Text>
//           </View>
//         ) : !weather ? (
//           // Error message when weather data is unavailable
//           <Text style={styles.errorText}>
//             Unable to fetch weather data. Please try again.
//           </Text>
//         ) : (
//           // Weather data display
//           <>
//             <Image
//               style={styles.weatherIcon}
//               source={{
//                 uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
//               }}
//             />
//             <View>
//               <Text style={styles.temperature}>{weather.main.temp}°C</Text>
//               <Text style={styles.location}>
//                 {weather.name}, {weather.sys.country}
//               </Text>
//               <Text style={styles.weatherDescription}>
//                 {weather.weather[0].description}
//               </Text>
//             </View>
//           </>
//         )}
//       </View>

//       {/* Detection container */}
//       <Text style={styles.sectionTitle}>Diagnosis Report</Text>
//       <View style={styles.detectSection}>
//         <View style={styles.detectContainer}>
//           <View style={styles.detectImgContainer}>
//             <Image
//               style={styles.detectIcons}
//               source={require("../assets/icons/scan.png")}
//             />
//               <Text style={styles.imageText}>Take picture</Text>
//           </View>

//           <View style={styles.detectImgContainer}>
//             <Image
//               style={styles.detectIcons}
//               source={require("../assets/icons/report.png")}
//             />
//             <Text style={styles.imageText}>View Report</Text>
//           </View>

//           <View style={styles.detectImgContainer}>
//             <Image
//               style={styles.detectIcons}
//               source={require("../assets/icons/medicne.png")}
//             />
//             <Text style={styles.imageText}>Suggestions</Text>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate("ChatBot")}}>
//           <Text style={styles.btnText}>Take Survey</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Tips Section */}
//     <Text style={styles.sectionTitle}>Tips for Plants and livestocks</Text>
//     <View style={styles.tipsGrid}>
//       <View style={styles.tipItem}>
//         <Image
//           source={require("../assets/images/crops.png")} // Replace with your image
//           style={styles.tipImage}
//         />
//         <Text style={styles.tipText}>
//         Get tips on soil, sunlight, and pruning for healthy, thriving plants.</Text>
//       </View>
//       <View style={styles.tipItem}>
//         <Image
//           source={require("../assets/icons/pesticide.png")} // Replace with your image
//           style={styles.tipImage}
//         />
//         <Text style={styles.tipText}>
//         Explore safe, eco-friendly ways to protect your crops from pests.        </Text>
//       </View>
//       <View style={styles.tipItem}>
//         <Image
//           source={require("../assets/icons/irrigation.png")} // Replace with your image
//           style={styles.tipImage}
//         />
//         <Text style={styles.tipText}>
//         Learn efficient watering techniques to boost crops and save water.        </Text>
//       </View>
//       <View style={styles.tipItem}>
//         <Image
//           source={require("../assets/icons/cow.png")} // Replace with your image
//           style={styles.tipImage}
//         />
//         <Text style={styles.tipText}>
//         Keep your animals healthy with feeding, care, and vaccination tips.        </Text>
//       </View>
//     </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     padding: 20,
//     paddingTop: 80,
//   },
//   loadingContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%", // Ensure it aligns with the card width
//     padding: 10,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//     width: "100%",
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     marginLeft: 10,
//   },
//   appTitle: {
//     fontSize: 24,
//     fontWeight: "900",
//     color: "#347928",
//   },
//   weatherCard: {
//     width: "100%",
//     flexDirection: "row",
//     backgroundColor: "#f5f6f7",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//     alignItems: "center",
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#333333",
//   },
//   location: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   weatherIcon: {
//     width: 120,
//     height: 120,
//     marginRight: 10,
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   temperature: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#000000",
//   },
//   weatherDescription: {
//     fontSize: 16,
//     color: "#666",
//     textTransform: "capitalize",
//   },
//   errorText: {
//     fontSize: 16,
//     color: "red",
//   },
//   detectContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//   },
//   detectSection: {
//     width: "100%",
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//     borderRadius: 10,
//     padding: 20,
//     marginTop: 10,
//   },
//   detectImgContainer: {
//     alignItems: "center",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333333",
//     marginTop: 40,
//     marginBottom: 8,
//     width: "100%",
//     textAlign: "left",
//   },
//   detectIcons: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   imageText: {
//     fontSize: 14,
//     color: "#333333",
//     fontWeight: "bold",
//   },
//   btn: {
//     height: 44,
//     width: "100%",
//     borderRadius: 30,
//     backgroundColor: "#FCCD2A",
//     marginTop: 30,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   btnText: {
//     textAlign: "center",
//     color: "#333333",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   tipsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   tipItem: {
//     width: "48%", // Two items per row with spacing
//     backgroundColor: "#f5f6f7",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   tipImage: {
//     width: 60,
//     height: 60,
//     marginBottom: 10,
//   },
//   tipText: {
//     fontSize: 14,
//     color: "#333",
//     textAlign: "center",
//   },
// });

// export default Home;



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import useChatGPT from "../hooks/useChatBot";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import your Firebase config
import { FontAwesome } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [reportCount, setReportCount] = useState(0);


  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const currentMonth = monthNames[new Date().getMonth()];

  const API_KEY = "6ecc21b866f6451785f4f772788d75a9"; // Replace with a valid OpenWeather API key
  const GPT_API_KEY = "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"; // Replace with your ChatGPT API key
  
  // const API_KEY = "api_key"; 
  // const GPT_API_KEY = "gpt_api_key";
  const { response, isLoading: aiLoading, sendMessage } = useChatGPT(GPT_API_KEY);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return alert("Permission to access location was denied.");
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        if (!userLocation) {
          setLoading(false);
          return alert("Unable to fetch location. Please try again.");
        }
        setLocation(userLocation);

        const { latitude, longitude } = userLocation.coords;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        setWeather(weatherResponse.data);

        fetchReportCount(latitude, longitude);


        const locationName = weatherResponse.data.name;
        const query = `What are the major diseases affecting livestock in ${locationName} and nearby area, during ${currentMonth}? Provide the disease names in a bullet-point format only, without any introduction, explanation, or summary.`;
        sendMessage(
          query,
          "You are an expert in agricultural and veterinary sciences. Always respond with a concise list in bullet-point format. No introduction, no summaries, suggestions."
        );
       } catch (error) {
        console.error("Error fetching weather:", error.response?.data || error.message);
        alert("Error fetching weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReportCount = async (latitude, longitude) => {
      try {
        const boundingBox = calculateBoundingBox(latitude, longitude, 50); // 5 km radius
  
        const reportsQuery = query(
          collection(db, "reports"),
          where("latitude", ">=", boundingBox.minLat),
          where("latitude", "<=", boundingBox.maxLat),
          where("longitude", ">=", boundingBox.minLon),
          where("longitude", "<=", boundingBox.maxLon)
        );
  
        const snapshot = await getDocs(reportsQuery);
        setReportCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching report count:", error.message);
        alert("Error fetching report count. Please try again.");
      }
    };
  
    const calculateBoundingBox = (latitude, longitude, radiusInKm) => {
      const earthRadius = 6371; // Earth's radius in km
  
      const latDelta = radiusInKm / earthRadius;
      const lonDelta = radiusInKm / (earthRadius * Math.cos((latitude * Math.PI) / 180));
  
      return {
        minLat: latitude - latDelta,
        maxLat: latitude + latDelta,
        minLon: longitude - lonDelta,
        maxLon: longitude + lonDelta,
      };
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (response) {
      setAiSuggestions(response);
    }
  }, [response]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      { reportCount>5 ?
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="exclamation-triangle" size={24} color="#ffcc00" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Cattle Disease Reports</Text>
          <Text style={styles.cardMessage}>
            There are <Text style={styles.countText}>{reportCount}</Text> reports of cattle diseases within a 50 km radius. Stay alert and take preventive measures.
          </Text>
        </View>
      </View> 
      : ""
      }

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        {loading ? (
          <ActivityIndicator size="small" color="#333333" />
        ) : weather ? (
          <>
            <Image
              style={styles.weatherIcon}
              source={{
                uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
              }}
            />
            <View>
              <Text style={styles.temperature}>{weather.main.temp}°C</Text>
              <Text style={styles.location}>
                {weather.name}, {weather.sys.country}
              </Text>
              <Text style={styles.weatherDescription}>
                {weather.weather[0].description}
              </Text>
            </View>
          </>
        ) : (
          <Text>Unable to fetch weather data.</Text>
        )}
      </View>

      {/* Detection container */}
      <Text style={styles.sectionTitle}>Diagnosis Report</Text>
      <View style={styles.detectSection}>
         <View style={styles.detectContainer}>
          <View style={styles.detectImgContainer}>
            <Image
              style={styles.detectIcons}
              source={require("../assets/icons/scan.png")}
            />
              <Text style={styles.imageText}>Take picture</Text>
          </View>

          <View style={styles.detectImgContainer}>
            <Image
              style={styles.detectIcons}
              source={require("../assets/icons/report.png")}
            />
            <Text style={styles.imageText}>View Report</Text>
          </View>

          <View style={styles.detectImgContainer}>
            <Image
              style={styles.detectIcons}
              source={require("../assets/icons/medicne.png")}
            />
            <Text style={styles.imageText}>Suggestions</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() =>   navigation.navigate("Question")}>
          <Text style={styles.btnText}>Take Survey</Text>
        </TouchableOpacity>
      </View>

      {/* AI Suggestions */}
      <Text style={styles.sectionTitle}>Livestock Disease Suggestions</Text>
      <View style={styles.aiCard}>
        {aiLoading ? (
          <ActivityIndicator size="small" color="#333333" />
        ) : aiSuggestions ? (
          <ScrollView>
            <Text style={styles.aiText}>{aiSuggestions}</Text>
          </ScrollView>
        ) : (
          <Text>No suggestions available yet.</Text>
        )}
      </View>

      {/* Tips Section */}
    <Text style={styles.sectionTitle}>Tips for Plants and livestocks</Text>
    <View style={styles.tipsGrid}>
      <View style={styles.tipItem}>
        <Image
          source={require("../assets/images/crops.png")} // Replace with your image
          style={styles.tipImage}
        />
        <Text style={styles.tipText}>
        Get tips on soil, sunlight, and pruning for healthy, thriving plants.</Text>
      </View>
      <View style={styles.tipItem}>
        <Image
          source={require("../assets/icons/pesticide.png")} // Replace with your image
          style={styles.tipImage}
        />
        <Text style={styles.tipText}>
        Explore safe, eco-friendly ways to protect your crops from pests.</Text>
      </View>
      <View style={styles.tipItem}>
        <Image
          source={require("../assets/icons/irrigation.png")} // Replace with your image
          style={styles.tipImage}
        />
        <Text style={styles.tipText}>
        Learn efficient watering techniques to boost crops and save water.</Text>
      </View>
      <View style={styles.tipItem}>
        <Image
          source={require("../assets/icons/cow.png")} // Replace with your image
          style={styles.tipImage}
        />
        <Text style={styles.tipText}>
        Keep your animals healthy with feeding, care, and vaccination tips.</Text>
      </View>
    </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
  },
  weatherIcon: {
    width: 120,
    height: 120,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  aiCard: {
    padding: 16,
    width: "100%", 
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20, // Improves readability
    color: "#333",
    flexWrap: "wrap",
  },
    scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 80,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensure it aligns with the card width
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#347928",
  },
  weatherCard: {
    padding: 10,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  temperature: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000000",
  },
  weatherDescription: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  detectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detectSection: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  detectImgContainer: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 40,
    marginBottom: 8,
    width: "100%",
    textAlign: "left",
  },
  detectIcons: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold",
  },
  btn: {
    height: 44,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#FCCD2A",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
  tipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  tipItem: {
    width: "48%", // Two items per row with spacing
    backgroundColor: "#f5f6f7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tipImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 4, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
    marginHorizontal: 15,
    width: "100%",
    marginBottom: 20
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebcc",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardMessage: {
    fontSize: 14,
    color: "#555",
  },
  countText: {
    fontWeight: "bold",
    color: "#ff5722",
  },
});

export default Home;