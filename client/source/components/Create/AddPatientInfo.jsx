import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../styles/globalStyles";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import patientService from "../../services/patientServices";
import { useDispatch, useSelector } from "react-redux";
import { createPatient } from "../../redux/patientSlice";
import { getUserInfo } from "../../redux/authSlice";

const AddPatientInfo = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.auth);

  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState();
  const [dementiaStage, setDementiaStage] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  const [currentAllergy, setCurrentAllergy] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [currentSurgery, setCurrentSurgery] = useState("");

  const userId = userInfo._id;
  const token = userToken;
  const handleAddItem = (setter, items, currentItem, setCurrentItem) => {
    if (currentItem.trim()) {
      setter([...items, currentItem.trim()]);
      setCurrentItem("");
    }
  };

  const handleRemoveItem = (setter, items, index) => {
    setter(items.filter((_, i) => i !== index));
  };

  const handleCreatePatient = async () => {
    try {
      const medicalInformation = {
        height: { feet: Number(heightFeet), inches: Number(heightInches) },
        weight: Number(weight),
        bloodType,
        allergies,
        medications,
        surgeries,
        dementiaStage,
        age: Number(age),
      };

      dispatch(
        createPatient({
          userId: userInfo._id,
          medicalInformation,
          token: userToken,
        })
      )
        .unwrap()
        .then((response) => {
          // Re-fetch user info to get the updated patientInfo
          dispatch(getUserInfo(userToken));
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log("Error creating patient:", error);
        });
    } catch (error) {
      console.log("Unexpected error:", error);
      setMessage("Unexpected error occurred");
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.screen,
        {
          width: "100%",
          height: "100%",
          backgroundColor: theme.backgroundColor,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text
          style={[
            globalStyles.name,
            { flex: 1, textAlign: "left", color: theme.text },
          ]}
        >
          Finish your profile
        </Text>
      </View>
      <ScrollView style={{ paddingVertical: 20 }}>
        <View style={styles.container}>
          {/* Height and Weight Inputs */}
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Height (feet)</Text>
            <TextInput
              style={globalStyles.textInput}
              keyboardType="number-pad"
              value={heightFeet}
              placeholder="6 feet"
              onChangeText={(text) => setHeightFeet(text)}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Height (inches)</Text>
            <TextInput
              style={globalStyles.textInput}
              keyboardType="number-pad"
              value={heightInches}
              onChangeText={(text) => setHeightInches(text)}
              placeholder="2 inches"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Weight (lbs)</Text>
            <TextInput
              style={globalStyles.textInput}
              keyboardType="number-pad"
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="220 pounds"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Age</Text>
            <TextInput
              style={globalStyles.textInput}
              keyboardType="number-pad"
              value={age}
              onChangeText={(text) => setAge(text)}
              placeholder="40 years old"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Dementia Stage</Text>
            <TextInput
              style={globalStyles.textInput}
              value={dementiaStage}
              onChangeText={(text) => setDementiaStage(text)}
              placeholder="Stage 1"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Blood Type</Text>
            <TextInput
              style={globalStyles.textInput}
              value={bloodType}
              onChangeText={(text) => setBloodType(text)}
              placeholder="A-"
            />
          </View>

          {/* Allergies Input */}
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Allergies</Text>
            <TextInput
              style={globalStyles.textInput}
              value={currentAllergy}
              onChangeText={setCurrentAllergy}
              onSubmitEditing={() =>
                handleAddItem(
                  setAllergies,
                  allergies,
                  currentAllergy,
                  setCurrentAllergy
                )
              }
              placeholder="Add allergies"
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              onPress={() =>
                handleAddItem(
                  setAllergies,
                  allergies,
                  currentAllergy,
                  setCurrentAllergy
                )
              }
            >
              <Icon name="add-circle" size={26} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {allergies.map((item, index) => (
              <View key={index} style={styles.itemBlock}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveItem(setAllergies, allergies, index)
                  }
                >
                  <Icon name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Medications Input */}
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Medications</Text>
            <TextInput
              style={globalStyles.textInput}
              value={currentMedication}
              onChangeText={setCurrentMedication}
              onSubmitEditing={() =>
                handleAddItem(
                  setMedications,
                  medications,
                  currentMedication,
                  setCurrentMedication
                )
              }
              placeholder="Add medications"
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              onPress={() =>
                handleAddItem(
                  setMedications,
                  medications,
                  currentMedication,
                  setCurrentMedication
                )
              }
            >
              <Icon name="add-circle" size={26} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {medications.map((item, index) => (
              <View key={index} style={styles.itemBlock}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveItem(setMedications, medications, index)
                  }
                >
                  <Icon name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Surgeries Input */}
          <View style={styles.formRow}>
            <Text style={globalStyles.label}>Surgeries</Text>
            <TextInput
              style={globalStyles.textInput}
              value={currentSurgery}
              onChangeText={setCurrentSurgery}
              onSubmitEditing={() =>
                handleAddItem(
                  setSurgeries,
                  surgeries,
                  currentSurgery,
                  setCurrentSurgery
                )
              }
              placeholder="Add surgeries"
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              onPress={() =>
                handleAddItem(
                  setSurgeries,
                  surgeries,
                  currentSurgery,
                  setCurrentSurgery
                )
              }
            >
              <Icon name="add-circle" size={26} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {surgeries.map((item, index) => (
              <View key={index} style={styles.itemBlock}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveItem(setSurgeries, surgeries, index)
                  }
                >
                  <Icon name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          height: 40,
          paddingHorizontal: 15,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.button,
            {
              height: 100,
              backgroundColor: theme.primary,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={handleCreatePatient}
        >
          <Text
            style={[styles.buttonText, { color: "white", fontWeight: 500 }]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  itemBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  itemText: {
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default AddPatientInfo;