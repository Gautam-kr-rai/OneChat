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
  className={`px-4 py-2 rounded-2xl text-sm break-words shadow-md backdrop-blur-md ${
    self
      ? "bg-blue-500/80 text-white rounded-br-none"
      : "bg-white/70 text-gray-900 border border-gray-200 rounded-bl-none"
  }`}
>
  {msg.content}
</div>
      </div>
    </div>
  );
}


