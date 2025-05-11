import express from "express";
import { getAllRooms, getMessages, sendMessage } from "../controllers/messagecontroller.js";
import { protect } from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/send", sendMessage);
router.get("/:roomId", getMessages);
router.get("/admin/all-rooms", getAllRooms);

export default router;