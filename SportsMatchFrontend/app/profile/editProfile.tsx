import { Colors, Typescale } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SPORT_TYPES } from "@/constants/game";

interface ProfileData {
  display_picture?: string;
  name: string;
  email: string;
  age: number;
  sport_interests: { [key: string]: number };
}

interface FormState {
  display_picture: string;
  name: string;
  email: string;
  age: string;
  sport_interests: { [key: string]: number };
}

interface FormAction {
  type: 'UPDATE_FIELD' | 'ADD_SPORT' | 'REMOVE_SPORT' | 'UPDATE_SPORT_LEVEL' | 'INIT_FROM_PARAMS';
  field?: keyof FormState;
  value?: any;
  sport?: string;
  level?: number;
  profileData?: ProfileData;
}

const SKILL_LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
  { value: 4, label: "Expert" },
];

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field!]: action.value };
    case 'ADD_SPORT':
      if (action.sport && !state.sport_interests[action.sport]) {
        return {
          ...state,
          sport_interests: { ...state.sport_interests, [action.sport]: 1 }
        };
      }
      return state;
    case 'REMOVE_SPORT':
      if (action.sport) {
        const newInterests = { ...state.sport_interests };
        delete newInterests[action.sport];
        return { ...state, sport_interests: newInterests };
      }
      return state;
    case 'UPDATE_SPORT_LEVEL':
      if (action.sport && action.level) {
        return {
          ...state,
          sport_interests: { ...state.sport_interests, [action.sport]: action.level }
        };
      }
      return state;
    case 'INIT_FROM_PARAMS':
      if (action.profileData) {
        return {
          display_picture: action.profileData.display_picture || '',
          name: action.profileData.name || '',
          email: action.profileData.email || '',
          age: action.profileData.age?.toString() || '',
          sport_interests: action.profileData.sport_interests || {},
        };
      }
      return state;
    default:
      return state;
  }
};

export default function EditProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSportForDropdown, setSelectedSportForDropdown] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const isEditMode = params.edit === 'true' && params.profileData;

  const [state, dispatch] = useReducer(formReducer, {
    display_picture: '',
    name: '',
    email: '',
    age: '',
    sport_interests: {},
  });

  useEffect(() => {
    if (isEditMode && params.profileData) {
      try {
        const profileData: ProfileData = JSON.parse(params.profileData as string);
        dispatch({ type: 'INIT_FROM_PARAMS', profileData });
      } catch (error) {
        console.error('Error parsing profile data:', error);
        setErrorMsg('Error loading profile data');
      }
    }
  }, [isEditMode, params.profileData]);

  const handleInputChange = (field: keyof FormState, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleAddSport = (sport: string) => {
    dispatch({ type: 'ADD_SPORT', sport });
  };

  const handleRemoveSport = (sport: string) => {
    dispatch({ type: 'REMOVE_SPORT', sport });
  };

  const handleOpenSkillDropdown = (sport: string) => {
    setSelectedSportForDropdown(sport);
    setDropdownVisible(true);
  };

  const handleSelectSkillLevel = (level: number) => {
    if (selectedSportForDropdown) {
      dispatch({ type: 'UPDATE_SPORT_LEVEL', sport: selectedSportForDropdown, level });
    }
    setDropdownVisible(false);
    setSelectedSportForDropdown(null);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    // Validate form
    if (!state.name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!state.email.trim()) {
      setErrorMsg("Please enter your email");
      return;
    }
    if (!state.email.includes('@')) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!state.age.trim()) {
      setErrorMsg("Please enter your age");
      return;
    }
    const ageNum = parseInt(state.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      setErrorMsg("Please enter a valid age");
      return;
    }

    // TODO: Implement API call to save/update profile
    const profileData: ProfileData = {
      display_picture: state.display_picture,
      name: state.name.trim(),
      email: state.email.trim(),
      age: ageNum,
      sport_interests: state.sport_interests,
    };

    try {
      // await saveProfileAsync(profileData);
      Alert.alert(
        "Success",
        isEditMode ? "Profile updated successfully!" : "Profile created successfully!",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/profile") }]
      );
    } catch (error: any) {
      setErrorMsg(isEditMode ? "Error updating profile" : "Error creating profile");
    }
  };

  const getSkillLevelLabel = (level: number) => {
    const skill = SKILL_LEVELS.find(s => s.value === level);
    return skill ? skill.label : "Unknown";
  };

  const availableSports = SPORT_TYPES.filter(sport => !state.sport_interests[sport]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingHorizontal: 12, marginTop: 16 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isEditMode ? "Edit Profile" : "Create Profile"}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Display Picture */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Picture</Text>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePictureWrapper}>
              {state.display_picture ? (
                <Image
                  source={{ uri: state.display_picture }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <Ionicons name="person" size={60} color={Colors.gray600} />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.changePictureButton}
              onPress={() => {
                // TODO: Implement image picker
                Alert.alert("Info", "Image picker functionality to be implemented");
              }}
            >
              <Text style={styles.changePictureButtonText}>Change Picture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.textInput}
            value={state.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your name"
            placeholderTextColor={Colors.gray500}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.textInput}
            value={state.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor={Colors.gray500}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.textInput}
            value={state.age}
            onChangeText={(value) => handleInputChange('age', value)}
            placeholder="Enter your age"
            placeholderTextColor={Colors.gray500}
            keyboardType="numeric"
          />
        </View>

        {/* Sport Interests */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sport Interests</Text>

          {/* Selected Sports */}
          {Object.keys(state.sport_interests).length > 0 && (
            <View style={styles.selectedSportsContainer}>
              {Object.entries(state.sport_interests).map(([sport, level]) => (
                <View key={sport} style={styles.sportChip}>
                  <View style={styles.sportChipContent}>
                    <Text style={styles.sportChipName}>{sport}</Text>
                    <TouchableOpacity
                      style={styles.skillLevelButton}
                      onPress={() => handleOpenSkillDropdown(sport)}
                    >
                      <Text style={styles.skillLevelButtonText}>
                        {getSkillLevelLabel(level)}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={Colors.gray700} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeSportButton}
                    onPress={() => handleRemoveSport(sport)}
                  >
                    <Ionicons name="close" size={20} color={Colors.gray700} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Sports */}
          {availableSports.length > 0 && (
            <View style={{ ...styles.inputGroup, marginHorizontal: -12, marginTop: 12 }}>
              <Text style={{ ...styles.label, paddingHorizontal: 12, marginBottom: 8 }}>Add Sports</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportScrollView}>
                {availableSports.map((sport: string) => (
                  <TouchableOpacity
                    key={sport}
                    style={styles.addSportButton}
                    onPress={() => handleAddSport(sport)}
                  >
                    <Ionicons name="add" size={20} color={Colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.addSportButtonText}>{sport}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Error Message */}
        {errorMsg ? (
          <Text style={styles.errorMsg}>{errorMsg}</Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isEditMode ? "Update Profile" : "Create Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Skill Level Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Skill Level</Text>
            {SKILL_LEVELS.map((skill) => (
              <TouchableOpacity
                key={skill.value}
                style={styles.modalOption}
                onPress={() => handleSelectSkillLevel(skill.value)}
              >
                <Text style={styles.modalOptionText}>{skill.label}</Text>
                {selectedSportForDropdown &&
                  state.sport_interests[selectedSportForDropdown] === skill.value && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray200,
  },
  headerText: {
    ...Typescale.headlineS,
  },
  backButton: {
    marginRight: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12
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
    backgroundColor: Colors.gray100,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  profilePictureWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: Colors.gray200,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    marginBottom: 12,
  },
  profilePicture: {
    width: '100%',
    height: '100%'
  },
  profilePicturePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray200
  },
  changePictureButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  changePictureButtonText: {
    ...Typescale.bodyM,
    color: 'white',
    fontWeight: '600',
  },
  sportScrollView: {
    marginTop: 8,
    paddingHorizontal: 12
  },
  addSportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.gray100,
  },
  addSportButtonText: {
    ...Typescale.labelM,
    color: Colors.primary,
  },
  selectedSportsContainer: {
    marginTop: 8,
    gap: 12,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryWhite,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryVeryLight,
  },
  sportChipContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sportChipName: {
    ...Typescale.bodyM,
    color: Colors.primaryDark,
    fontWeight: '600',
    minWidth: 100,
  },
  skillLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray300,
    gap: 4,
  },
  skillLevelButtonText: {
    ...Typescale.bodyS,
    color: Colors.gray700,
  },
  removeSportButton: {
    padding: 4,
  },
  errorMsg: {
    color: "red",
    ...Typescale.bodyM,
    marginTop: 8,
    marginBottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  modalTitle: {
    ...Typescale.titleM,
    color: Colors.gray900,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalOptionText: {
    ...Typescale.bodyL,
    color: Colors.gray900,
  },
});

