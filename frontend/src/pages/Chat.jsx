import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import socket from "../socket";
import ChatRoom from "../components/ChatRoom";
import { toast } from "react-hot-toast";

export default function Chat() {
  const user = useAuthStore((s) => s.user);
 
  useEffect(() => {
    if (!user?.roomId) return;

    socket.emit("join-room", user.roomId);

    const startsWithR = (str) => typeof str === "string" && str.charAt(0).toLowerCase() === "r";

    if (startsWithR(user.username) || startsWithR(user.email)) {
      toast(
        `Hi, ${user.username}, ask about yourself. Once I'm ready, I will type here !`,
        {
          duration: 10000,
          style: {
            maxWidth: "360px",
            fontSize: "14px",
          },
        }
      );
    }
  }, [user.roomId, user.username, user.email]);

  return <ChatRoom roomId={user.roomId} />;
}
