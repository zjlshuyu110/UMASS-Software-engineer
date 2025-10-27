import { Colors, Typescale } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SPORT_TYPES } from "@/constants/game";
import { Game } from "@/src/models/Game";
import { useAppSelector } from "@/hooks/reduxHooks";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function NewGameForm() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailInput, setEmailInput] = useState("");

  interface FormState {
    name: string;
    sportType: string;
    maxPlayers: number;
    startAt: string;
    location: string;
    invitedEmails: string[];
  }

  interface FormAction {
    type: 'UPDATE_FIELD';
    field: keyof FormState;
    value: any;
  }

  const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, {
    name: '',
    sportType: '',
    maxPlayers: 2,
    startAt: '',
    location: '',
    invitedEmails: [],
  });

  const handleInputChange = (field: keyof FormState, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      if (!state.invitedEmails.includes(emailInput.trim())) {
        handleInputChange('invitedEmails', [...state.invitedEmails, emailInput.trim()]);
        setEmailInput("");
      } else {
        setErrorMsg("Email already added");
      }
    } else {
      setErrorMsg("Please enter a valid email address");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    handleInputChange('invitedEmails', state.invitedEmails.filter(email => email !== emailToRemove));
  };


  const handleSubmit = () => {
    // Validate form
    if (!state.name.trim()) {
      setErrorMsg("Please enter a game name");
      return;
    }
    if (!state.sportType) {
      setErrorMsg("Please select a sport type");
      return;
    }
    if (!state.startAt) {
      setErrorMsg("Please select a start date and time");
      return;
    }
    if (state.maxPlayers < 2) {
      setErrorMsg("Maximum players must be at least 2");
      return;
    }

    // Create new game
    const newGame: Game = {
      name: state.name,
      sportType: state.sportType,
      creator: (user as any)?.email || 'Unknown',
      players: [(user as any)?.email || 'Unknown'],
      maxPlayers: state.maxPlayers,
      status: 'active',
      startAt: new Date(state.startAt),
      createdAt: new Date(),
      location: state.location,
    };

    Alert.alert("Success", "Game created successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          className="flex-1 w-full"
        >
          <Ionicons name="arrow-back" size={30} color="#881c1c" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create New Game</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Game Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Game Name *</Text>
            <TextInput
              style={styles.textInput}
              value={state.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter game name"
              placeholderTextColor={Colors.gray500}
            />
          </View>

          {/* Sport Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sport Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportScrollView}>
              {SPORT_TYPES.map((sport: string) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.sportButton,
                    state.sportType === sport && styles.sportButtonSelected
                  ]}
                  onPress={() => handleInputChange('sportType', sport)}
                >
                  <Text style={[
                    styles.sportButtonText,
                    state.sportType === sport && styles.sportButtonTextSelected
                  ]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Max Players */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maximum Players *</Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('maxPlayers', Math.max(2, state.maxPlayers - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.gray700} />
              </TouchableOpacity>
              <Text style={styles.numberText}>{state.maxPlayers}</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('maxPlayers', state.maxPlayers + 1)}
              >
                <Ionicons name="add" size={20} color={Colors.gray700} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Start Date & Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date & Time *</Text>
            <TextInput
              style={styles.textInput}
              value={state.startAt}
              onChangeText={(value) => handleInputChange('startAt', value)}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor={Colors.gray500}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={state.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Enter location"
              placeholderTextColor={Colors.gray500}
            />
          </View>

          {/* Invite Players */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Invite Players (Optional)</Text>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.emailInput}
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="Enter email address"
                placeholderTextColor={Colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.addEmailButton}
                onPress={handleAddEmail}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Invited Emails List */}
            {state.invitedEmails.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.emailsScrollView}
              >
                {state.invitedEmails.map((email, index) => (
                  <View key={index} style={styles.emailChip}>
                    <Text style={styles.emailChipText}>{email}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveEmail(email)}
                      style={styles.removeEmailButton}
                    >
                      <Ionicons name="close" size={16} color={Colors.gray600} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <Text style={styles.errormsg}>
            {errorMsg}
          </Text>
          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errormsg:{
    color:"red"
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryWhite,
  },
  headerText: {
    ...Typescale.headlineL,
    color: "#881c1c",
    textAlign: 'center',
  },
  backButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...Typescale.labelL,
    color: Colors.gray900,
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.gray900,
    backgroundColor: Colors.primaryWhite,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sportScrollView: {
    marginTop: 8,
  },
  sportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray300,
    backgroundColor: Colors.primaryWhite,
  },
  sportButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sportButtonText: {
    ...Typescale.labelM,
    color: Colors.gray700,
  },
  sportButtonTextSelected: {
    color: Colors.primaryWhite,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  numberText: {
    ...Typescale.headlineM,
    color: Colors.gray900,
    minWidth: 40,
    textAlign: 'center',
  },
  skillLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  skillButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  skillButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skillButtonText: {
    ...Typescale.labelL,
    color: Colors.gray700,
    fontWeight: '600',
  },
  skillButtonTextSelected: {
    color: Colors.primaryWhite,
  },
  skillLevelDescription: {
    ...Typescale.bodyS,
    color: Colors.gray600,
    marginTop: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    ...Typescale.labelL,
    color: Colors.primaryWhite,
    fontWeight: '600',
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.gray900,
    backgroundColor: Colors.primaryWhite,
    marginRight: 8,
  },
  addEmailButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailsScrollView: {
    marginTop: 12,
    maxHeight: 50,
  },
  emailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  emailChipText: {
    ...Typescale.bodyS,
    color: Colors.gray700,
    marginRight: 6,
  },
  removeEmailButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
