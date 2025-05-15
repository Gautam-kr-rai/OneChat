import { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import socket from "../socket";
import useAuthStore from "../store/authStore";
import EmojiPicker from "emoji-picker-react";
import { Smile, Send } from "lucide-react";

export default function InputBox({ roomId, setMessages }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const pickerRef = useRef(null);
  const textareaRef = useRef(null);
  const user = useAuthStore((s) => s.user);

  const handleChange = (e) => {
  setText(e.target.value);

  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }

  if (e.target.value.trim()) {
    socket.emit("typing", { roomId, username: user.username });
  }
};

  const handleKeyDown = (e) => {
  // For mobile devices, always allow new lines with the enter key
  if (window.innerWidth < 768) {
    // On mobile, only send when clicking the send button
    return;
  }
  
  // For desktop: send on Enter, new line on Shift+Enter
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
};

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const send = async () => {
  const trimmed = text.trim();
  if (!trimmed || isSending) return;

  setIsSending(true);

  try {
    const res = await axios.post("/api/message/send", {
      roomId,
      senderId: user._id,
      content: trimmed,
    });

    socket.emit("message", { message: res.data, room: roomId });
    setText(""); // clears text

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset to auto before recomputing
      textareaRef.current.rows = 1;
    }

    setSendSuccess(true);

    setTimeout(() => {
      setSendSuccess(false);
      setIsSending(false);
      textareaRef.current?.focus();
    }, 300);
  } catch (err) {
    console.error("Error sending message:", err);
    setIsSending(false);
    textareaRef.current?.focus();
  }
};

  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target) &&
        (!pickerRef.current || !pickerRef.current.contains(event.target))
      ) {
        textareaRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 px-3 py-2 sm:py-3 flex items-end  border-t">
        {/* Emoji button */}
        <button
          type="button"
          onClick={() => {
            setShowPicker((prev) => !prev);
            textareaRef.current?.focus();
          }}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          inputMode="text"
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-36 resize-none overflow-auto px-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-400 whitespace-pre-wrap"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={send}
          disabled={isSending}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors duration-300 ${
            sendSuccess
              ? "bg-green-500 text-white"
              : isSending
              ? "bg-blue-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-16 left-3 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
        </div>
      )}
    </div>
  );
}
