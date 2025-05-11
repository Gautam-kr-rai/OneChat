// MessageBubble.jsx
import { format } from "date-fns";

export default function MessageBubble({ msg, self }) {
  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"}`}>
      {/* {!self && (
        <img
          src={msg.sender?.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )} */}
      <div className="max-w-md">
        <div
          className={`text-xs text-gray-500 mb-1 ${
            self ? "text-right" : ""
          }`}
        >
          <span className="font-medium">{msg.sender?.username}</span> ·{" "}
          {format(new Date(msg.createdAt), "hh:mm a")}
        </div>
        <div
          className={`rounded-lg px-3 py-2 ${
            self ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
          }`}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}


