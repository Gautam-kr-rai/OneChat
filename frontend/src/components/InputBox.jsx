import { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import socket from "../socket";
import useAuthStore from "../store/authStore";
import EmojiPicker from "emoji-picker-react";
import { Smile, Send, Check } from "lucide-react";

export default function InputBox({ roomId, setMessages }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const user = useAuthStore((s) => s.user);

  // Handle keyboard appearance on mobile
  useEffect(() => {
    const handleFocus = () => {
      // Scroll to bottom when input is focused
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
      }
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (value.trim()) {
      socket.emit("typing", { roomId, username: user.username });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const send = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    
    try {
      const res = await axios.post("/api/message/send", {
        roomId,
        senderId: user._id,
        content: text,
      });
      socket.emit("message", { message: res.data, room: roomId });
      setText("");
      setSendSuccess(true);
      
      setTimeout(() => {
        setSendSuccess(false);
        setIsSending(false);
        inputRef.current.focus();
      }, 1000);
    } catch (err) {
      console.error("Error sending message:", err);
      setIsSending(false);
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 border-t">
      {/* Emoji Picker Toggle Button */}
      <button
        onClick={() => {
          setShowPicker((prev) => !prev);
          inputRef.current.focus();
        }}
        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        type="button"
      >
        <Smile className="w-6 h-6" />
      </button>

      {/* Input */}
      <input
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && send()}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Type a message..."
      />

      {/* Send Button with Animation */}
      <button
        onClick={send}
        disabled={isSending}
        className={`relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full transition-all ${
          sendSuccess 
            ? "bg-green-500" 
            : isSending 
              ? "bg-blue-600" 
              : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {sendSuccess ? (
          <Check className="w-6 h-6 text-white animate-bounce" />
        ) : isSending ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
          </div>
        ) : (
          <Send className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-full left-2 mb-2 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
        </div>
      )}
    </div>
  );
}