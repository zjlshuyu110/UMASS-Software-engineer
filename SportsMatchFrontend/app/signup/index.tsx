import { useRouter } from "expo-router";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { loadToken, login } from "@/src/redux/slices/userSlice";
import { signup, verifyOTP } from "@/src/apiCalls/auth";
import { useEffect, useState } from "react";
import SignUpForm from "@/src/components/signup/sign-up-form";
import VerifyOTP from "@/src/components/signup/verify-otp";

export default function SignUpFormPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkIfTokenExists() {
      if (await dispatch(loadToken()).unwrap()) {
        router.push("../profile/editProfile");
      }
    }
    checkIfTokenExists();
  }, []);

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSignUp = () => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      name.length > 0 &&
      reenteredPassword.length > 0
    ) {
      if (password !== reenteredPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      setErrorMessage("");
      signup(name, email, password)
        .then((response) => {
          if (response === true) {
            setIsOTPSent(true);
            setErrorMessage("");
          } else {
            setErrorMessage("Signup failed. Please try again.");
          }
        })
        .catch((error) => {
          if (error.message === "User already exists") {
            setErrorMessage("You already have an account. Please log in.");
          } else {
            setErrorMessage("Signup failed. Please try again.");
          }
        });
    } else {
      setErrorMessage("Please fill in all fields.");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 0) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    verifyOTP(email, otp)
      .then((response) => {
        setErrorMessage("");
        dispatch(login({ email, token: response as string }));
        router.push("../profile/editProfile");
        // Handle successful OTP verification (e.g., navigate to the next screen)
      })
      .catch((error) => {
        if (error.message === "Invalid OTP") {
          setErrorMessage("The OTP you entered is invalid.");
        } else {
          setErrorMessage("OTP verification failed. Please try again.");
        }
      });
  };

  const handleBack = () => {
    router.back();
  };
  if (!isOTPSent) {
    return (
      <SignUpForm
        setEmail={setEmail}
        setPassword={setPassword}
        setReenteredPassword={setReenteredPassword}
        setName={setName}
        handleBack={handleBack}
        handleSignUp={handleSignUp}
        errorMessage={errorMessage}
      />
    );
  }
  return (
    <VerifyOTP
      setOTP={setOTP}
      handleBack={handleBack}
      handleVerifyOTP={handleVerifyOTP}
      errorMessage={errorMessage}
    />
  );
}
