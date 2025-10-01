import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import background from "@/assets/images/background.jpg";
import mainLogo from "@/assets/images/main-logo.png";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <Image source={mainLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("/login");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.buttonSpacer} />

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    opacity: 10,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.25,
  },
  buttonContainer: {
    marginTop: 40,
    width: screenWidth * 0.7,
  },
  buttonSpacer: {
    height: 16,
  },
  loginButton: {
    backgroundColor: "#881c1c",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: "#881c1c",
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  signupButtonText: {
    color: "#8c1c1c",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
