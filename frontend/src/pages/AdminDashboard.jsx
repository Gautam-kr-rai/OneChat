import { useEffect, useState } from "react";
import axios from "../api/axios";
import ChatRoom from "../components/ChatRoom";
import socket from "../socket";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/message/admin/all-rooms").then((res) => {
      const users = res.data.map((user) => ({
        ...user,
        userId: user._id, // Add userId field explicitly if not provided
        isOnline: false,
      }));
      setRooms(users);
    });
  }, []);

  useEffect(() => {
    if (currentRoom) {
      socket.emit("join-room", currentRoom);
      setSidebarOpen(false);
    }
  }, [currentRoom]);

  useEffect(() => {
    const handleOnlineUsers = (onlineUserIds) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          isOnline: onlineUserIds.includes(room.userId),
        }))
      );
    };

    socket.on("online-users", handleOnlineUsers);

    // Ask server who is online on initial load
    socket.emit("get-online-users");

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <button
        className="absolute top-4 left-4 z-20 p-2 bg-white dark:bg-gray-800 border rounded-md md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-10 w-64 p-4 space-y-2 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0 md:flex md:flex-col md:w-1/3`}
      >
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Available Users
        </h2>
        {rooms.map((u) => (
          <div
            key={u.roomId}
            onClick={() => setCurrentRoom(u.roomId)}
            className={`cursor-pointer p-2 rounded-md flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 ${
              currentRoom === u.roomId
                ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <span>{u.username}</span>
            {u.isOnline && (
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"
                title="Online"
              ></span>
            )}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-950">
        {currentRoom ? (
          <ChatRoom roomId={currentRoom} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}
