import { useState, useRef } from "react";
import axios from "../api/axios";
import socket from "../socket";
import useAuthStore from "../store/authStore";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

export default function InputBox({ roomId, setMessages }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const user = useAuthStore((s) => s.user);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (value.trim()) {
      socket.emit("typing", { roomId, username: user.username });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const send = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post("/api/message/send", {
        roomId,
        senderId: user._id,
        content: text,
      });
      socket.emit("message", { message: res.data, room: roomId });
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="relative border-t bg-white dark:bg-gray-900 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2">
      {/* Emoji Picker Toggle Button */}
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        type="button"
      >
        <Smile className="w-6 h-6" />
      </button>

      {/* Input */}
      <input
        value={text}
        onChange={handleChange}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Type a message..."
      />

      {/* Send Button */}
      <button
        onClick={send}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
      >
        Send
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-2 mb-2 z-50"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
        </div>
      )}
    </div>
  );
}
