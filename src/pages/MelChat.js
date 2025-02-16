import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import "./MelChat.css"; // Ensure this contains proper styles

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

    if (!user) {
      setMessages([...messages, { role: "user", content: input }, { role: "bot", content: "Please log in to chat with Mel." }]);
      setInput("");
      return;
    }

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
        <div className="chat-title">What can I help with?</div>
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
            Log in
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
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Mel"
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
        {!user && <p className="login-warning">You must log in to chat with Mel.</p>}
      </div>
    </div>
  );
};

export default MelChat;
