import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import socket from "../socket";
import ChatRoom from "../components/ChatRoom";

export default function Chat() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    socket.emit("join-room", user.roomId);
  }, [user.roomId]);

  return <ChatRoom roomId={user.roomId} />;
}
