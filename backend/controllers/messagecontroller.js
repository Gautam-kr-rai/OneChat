import Message from "../models/messagemodel.js";
import User from "../models/usermodel.js"

export const sendMessage = async (req, res) => {
  const { roomId, senderId, content } = req.body;
  try {
    const message = await Message.create({ roomId, sender: senderId, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).populate("sender", "username");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    // Only fetch users with 'user' role and a valid roomId
    const users = await User.find({
      role: "user",
      roomId: { $exists: true, $ne: null }
    }).select("username email roomId");

    res.status(200).json(users); // even if empty, return 200
  } catch (err) {
    console.error("Error in getAllRooms:", err.message);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};
