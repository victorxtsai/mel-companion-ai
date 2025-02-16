import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import "./MelChat.css"; // Ensure this contains the updated styles

const MelChat = () => {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference to scroll into view

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Scroll to the latest message whenever `messages` updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = async () => {
    window.location.href = "https://auth.mindwellworld.com/"; 
  };  

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!user) {
      setMessages([...messages, 
        { role: "user", content: input }, 
        { role: "bot", content: "Please sign in to chat with Mel." }
      ]);
      setInput("");
      return;
    }

    const response = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([
      ...messages, 
      { role: "user", content: input }, 
      { role: "bot", content: data.choices[0].message.content }
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="chat-title">Mel</div>
        </div>
        {user ? (
          <div className="profile-menu">
            <img
              src={user.photoURL || "default-avatar.png"}
              alt="Profile"
              className="profile-icon"
            />
            <div className="dropdown">
              <button onClick={() => console.log("Go to settings")}>Settings</button>
              <button onClick={() => console.log("Edit Plan")}>Edit Plan</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Sign in
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
        {/* Empty div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Mel"
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
        
        {/* Ensure warning is always visible */}
        {!user && <p className="login-warning">You must sign in to chat with Mel.</p>}
      </div>

      {/* Footer */}
      <footer className="chat-footer">
        <a 
          href="https://www.mindwellworld.com" 
          style={{ color: "black", textDecoration: "none" }}
        >
          A Mindwell World
        </a>{" "}
        |{" "}
        <a 
          href="https://www.mindwell.io" 
          style={{ color: "black", textDecoration: "none" }}
        >
          App
        </a>
      </footer>
    </div>
  );
};

export default MelChat;
