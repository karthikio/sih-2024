// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const Question = ({ navigation }) => {
//   const questions = [
//     "Is the livestock showing signs of lethargy?",
//     "Is there any loss of appetite?",
//     "Are there any visible sores or lesions?",
//     "Is the animal experiencing difficulty in movement?",
//     "Is there abnormal discharge from the nose or eyes?",
//   ];

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);

//   const handleAnswer = (answer) => {
//     // Create a new array with the current answers plus the new answer
//     const updatedAnswers = [...answers, answer];
    
//     // Update the answers state
//     setAnswers(updatedAnswers);
    
//     // Check if this is the last question
//     if (currentQuestion < questions.length - 1) {
//       // If not the last question, move to the next question
//       setCurrentQuestion((prev) => prev + 1);
//     } else {
//       // If it's the last question, navigate to ChatBot with all answers
//       navigation.navigate('ChatBot', { answers: updatedAnswers });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.question}>{questions[currentQuestion]}</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Yes" onPress={() => handleAnswer('Yes')} />
//         <Button title="No" onPress={() => handleAnswer('No')} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   question: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '60%',
//   },
// });

// export default Question;



import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { auth, db} from '../firebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const Question = ({ navigation }) => {
  const [cattle, setCattle] = useState([]);
  const [selectedCattle, setSelectedCattle] = useState(null);

  const questions = [
    "Is the livestock showing signs of lethargy?",
    "Is there any loss of appetite?",
    "Are there any visible sores or lesions?",
    "Is the animal experiencing difficulty in movement?",
    "Is there abnormal discharge from the nose or eyes?",
  ];

  const [answers, setAnswers] = useState(
    questions.map(() => null)
  );

  const updateAnswer = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const isAllQuestionsAnswered = () => {
    return answers.every(answer => answer !== null);
  };

  const handleContinue = () => {
    if (isAllQuestionsAnswered()) {
      const formattedAnswers = questions.map((question, index) => ({
        question,
        answer: answers[index]
      }));

      const selectedCattleData = cattle.find((c) => c.id === selectedCattle);

      navigation.navigate("ChatBot", {
        answers: formattedAnswers,
        cattle: selectedCattleData?.id,
      });    
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cattleRef = collection(doc(db, "users", currentUser.uid), "cattle");

      const unsubscribe = onSnapshot(cattleRef, (querySnapshot) => {
        const fetchedCattle = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCattle(fetchedCattle);
        if (fetchedCattle.length > 0) {
          setSelectedCattle(fetchedCattle[0].id); // Default to the first cattle
        }
      });

      return () => unsubscribe(); // Clean up listener
    }
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
      <Text style={styles.title}>Livestock Health Assessment</Text>
      {cattle ? 
        <TouchableOpacity 
        style={[
          styles.continueButton, 
        ]}
        onPress={
          () => {navigation.navigate("AddCattle")}
        }
      >
        <Text style={styles.continueButtonText}>Add Cattle</Text>
      </TouchableOpacity>
      :
        <>  
        {/* Cattle Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select your Cattle:</Text>
          <Picker
            selectedValue={selectedCattle}
            onValueChange={(itemValue) => setSelectedCattle(itemValue)}
            style={styles.picker}
          >
            {cattle.map((c) => (
              <Picker.Item key={c.id} label={c.breed} value={c.id} />
            ))}
          </Picker>
        </View>
        </>

      }

        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.answerButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.answerButton, 
                  answers[index] === 'Yes' && styles.selectedButton
                ]}
                onPress={() => updateAnswer(index, 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.answerButton, 
                  answers[index] === 'No' && styles.selectedButton
                ]}
                onPress={() => updateAnswer(index, 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !isAllQuestionsAnswered() && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!isAllQuestionsAnswered()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#2c3e50',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  answerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f5f6f7',
    alignItems: 'center',
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: "#333333"
  },
  buttonText: {
    color: '#333333',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#FCCD2A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Question;