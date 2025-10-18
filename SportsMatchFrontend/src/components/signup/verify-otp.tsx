import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import mainLogo from "@/assets/images/main-logo.png";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import React from "react";

type VerifyOTPProps = {
  setOTP: (value: string) => void;
  handleBack: () => void;
  handleVerifyOTP: () => void;
  errorMessage?: string | null;
};

export default function VerifyOTP({
  setOTP,
  handleBack,
  handleVerifyOTP,
  errorMessage,
}: VerifyOTPProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        className="flex-1 w-full"
      >
        <Ionicons name="arrow-back" size={30} color="#881c1c" />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <View style={{ alignItems: "center" }}>
          <Image source={mainLogo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}>
          Verify your email by entering the OTP sent to your email address.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="OTP"
          onChangeText={setOTP}
          secureTextEntry
          placeholderTextColor={"#888"}
        />
        <Text style={{ color: "red" }}>{errorMessage}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleVerifyOTP}>
          <Text style={styles.loginButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#881c1c",
    fontWeight: "600",
  },
  formContainer: {
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20,
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#000000",
  },
  loginButton: {
    backgroundColor: "#881c1c",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: screenWidth * 0.75,
    height: screenHeight * 0.18,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
