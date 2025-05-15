import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import socket from "../socket";
import useAuthStore from "../store/authStore";
import InputBox from "./InputBox";
import MessageBubble from "./MessageBubble";

export default function ChatRoom({ roomId }) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/message/${roomId}`).then((res) => {
      setMessages(res.data);
    });

    socket.on("user-typing", ({ username }) => {
      setTyping(`${username} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("receive-message", (msg) => {
      const normalized = normalizeMessage(msg);
      setMessages((prev) => [...prev, normalized]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
    };
  }, [roomId]);

  // Handle keyboard visibility changes on mobile
  useEffect(() => {
    if (!('visualViewport' in window)) return;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setKeyboardHeight(0);
        return;
      }

      const visualViewport = window.visualViewport;
      const windowHeight = window.innerHeight;
      const viewportHeight = visualViewport.height;
      const newKeyboardHeight = windowHeight - viewportHeight;

      setKeyboardHeight(newKeyboardHeight > 50 ? newKeyboardHeight : 0);
      
      // Scroll to bottom when keyboard appears
      if (newKeyboardHeight > 0) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const normalizeMessage = (msg) => {
    if (typeof msg.sender === "string") {
      return { ...msg, sender: { _id: msg.sender } };
    }
    return msg;
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-500 to-slate-900 dark:bg-gray-900 transition-colors duration-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-400 to-slate-900 dark:bg-gray-800 p-4 shadow-md sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-blue-900">
          🎶 Chat Room
        </h2>
      </div>

      {/* Messages Container - dynamically adjusts for keyboard */}
      <div 
  ref={messagesContainerRef}
  className="flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3 space-y-2 sm:space-y-3"
  style={{
    scrollPaddingBottom: '2px',
    paddingBottom: `4rem` // enough room for InputBox
  }}
>
        {messages.map((msg, i) => {
          const isSelf = msg.sender?._id === user?._id;
          return <MessageBubble key={i} msg={msg} self={isSelf} />;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing Indicator */}
      {typing && typing !== `${user.username} is typing...` && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic px-3 pb-1 sm:px-4 sm:pb-2">
          {typing}
        </div>
      )}

      {/* Input Box */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 pb-[env(safe-area-inset-bottom)]">
  <InputBox roomId={roomId} setMessages={setMessages} />
</div>
    </div>
  );
}