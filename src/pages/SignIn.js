import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithPhoneNumber,
  // For Apple sign-in, you'll need to configure 
  // a provider or use a custom approach (Firebase doesn't have 
  // an official Apple provider like Google).
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Handle Email/Password Sign Up
  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign-up successful!");
      window.location.href = "/"; // Redirect if desired
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Handle Email/Password Sign In
  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sign-in successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google sign-in successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Handle Phone Sign In (requires correct Firebase setup & reCAPTCHA)
  const handlePhoneSignIn = async () => {
    // You will need to set up Firebase RecaptchaVerifier in your code.
    // For simplicity, this is a placeholder:
    /*
    const appVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      // Then confirm with the code user receives via SMS
      const confirmationCode = window.prompt("Please enter the 6-digit code:");
      await confirmationResult.confirm(confirmationCode);
      alert("Phone sign-in successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    */
    alert("Phone sign-in requires additional Firebase setup.");
  };

  // Handle Apple Sign In
  const handleAppleSignIn = () => {
    // Apple sign-in typically requires a custom provider approach or 
    // an external library. This is just a placeholder.
    alert("Apple sign-in requires additional configuration.");
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Sign In / Sign Up</h1>

      {/* Email/Password */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Email/Password</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button onClick={handleEmailSignIn} style={{ marginRight: "10px" }}>
          Sign In with Email
        </button>
        <button onClick={handleEmailSignUp}>Sign Up with Email</button>
      </div>

      {/* Phone */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Phone</h3>
        <input
          type="text"
          placeholder="Phone Number (+1...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button onClick={handlePhoneSignIn}>Sign In with Phone</button>
        {/* You need a Recaptcha container: */}
        <div id="recaptcha-container"></div>
      </div>

      {/* Google */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      </div>

      {/* Apple */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleAppleSignIn}>Sign In with Apple</button>
      </div>
    </div>
  );
};

export default SignIn;
