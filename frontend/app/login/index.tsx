import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import mainLogo from "@/assets/images/main-logo.png";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useAppDispatch } from "@/hooks/reduxHooks";
import { loadToken, login } from "@/src/redux/slices/userSlice";
import { login as loginApi } from "@/src/apiCalls/auth";
import { use, useEffect, useState } from "react";

export default function LoginForm() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkIfTokenExists() {
      if (await dispatch(loadToken()).unwrap()) {
        router.push("../(tabs)");
      }
    }
    checkIfTokenExists();
  }, []);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = () => {
    if (email.length > 0 && password.length > 0) {
      loginApi(email, password)
        .then((response) => {
          dispatch(login({ email, token: response as string }));
          router.push("../(tabs)");
        })
        .catch((error) => {
          if (error.message === "Invalid credentials") {
            setErrorMessage("Invalid email or password.");
          } else {
            setErrorMessage("Login failed. Please try again.");
          }
        });
    } else {
      setErrorMessage("Please enter both email and password.");
    }
  };

  const handleBack = () => {
    router.back();
  };

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
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={"#888"}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={"#888"}
        />
        <Text style={{ color: "red" }}>{errorMessage}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
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
