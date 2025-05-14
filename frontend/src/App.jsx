import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import useThemeStore from "./store/theamStore"; 
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import socket from "./socket"; // ✅ Don't forget this

export default function App() {
  const { dark, toggleTheme } = useThemeStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?._id) {
      socket.emit("user-online", { userId: user._id });
    }
  }, [user]);

  return (
  <div
    className={
      dark
        ? "dark bg-black text-dark-blue-900 min-h-screen"
        : "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-black min-h-screen"
    }
  >
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md transition-colors"
      aria-label="Toggle Theme"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-900" />
      )}
    </button>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </div>
);

  
}
