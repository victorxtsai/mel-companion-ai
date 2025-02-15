import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import "./MelChat.css"; // Styling for chat UI

const MelChat = () => {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Handle Sending Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    // If user is NOT logged in, return "Please log in"
    if (!user) {
      setMessages([...messages, { role: "user", content: input }, { role: "bot", content: "Please log in to chat with Mel." }]);
      setInput("");
      return;
    }

    // If user IS logged in, send message to backend
    const response = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([...messages, { role: "user", content: input }, { role: "bot", content: data.choices[0].message.content }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2>Mel AI</h2>
        {user ? (
          <div className="profile-menu">
            <img src={user.photoURL || "default-avatar.png"} alt="Profile" className="profile-icon" />
            <div className="dropdown">
              <button onClick={() => console.log("Go to settings")}>Settings</button>
              <button onClick={() => console.log("Edit Plan")}>Edit Plan</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MelChat;
