import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import Login from "../Login";

const Chatbot = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome, {user.displayName || user.email}!</h2>
      <p>Start chatting with Mel AI.</p>
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Chatbot;
