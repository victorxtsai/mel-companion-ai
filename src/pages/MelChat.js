import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConfig";
import { signInWithCustomToken, signOut } from "firebase/auth";
import "./MelChat.css";

const MelChat = () => {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 1) Check for token in URL on mount, sign in if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Attempt to sign in with the custom token
      signInWithCustomToken(auth, token)
        .then(() => {
          console.log("Signed in with custom token on mel.mindwell.io");
          // Optional: remove 'token' from the URL to clean up
          params.delete("token");
          window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
        })
        .catch((err) => {
          console.error("Error with custom token sign-in:", err);
        });
    }
  }, []);

  // 2) Listen for changes in auth state (user logged in/out)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // 3) Scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4) If user not signed in, redirect to Auth with `?redirect=`
  const handleLogin = () => {
    const currentUrl = window.location.href;
    window.location.href =
      `https://auth.mindwellworld.com/?redirect=${encodeURIComponent(currentUrl)}`;
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

        {!user && <p className="login-warning">You must sign in to chat with Mel.</p>}
      </div>

      {/* Footer */}
      <footer className="chat-footer">
        <a
          href="https://www.mindwell.io"
          style={{ color: "black", textDecoration: "none" }}
        >
          App
        </a>{" "}
        |{" "}
        <a
          href="https://www.mindwellworld.com"
          style={{ color: "black", textDecoration: "none" }}
        >
          A Mindwell World
        </a>
      </footer>
    </div>
  );
};

export default MelChat;
