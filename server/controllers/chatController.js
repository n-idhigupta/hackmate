import Message from "../models/Message.js";

export const getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const messages = await Message.find({ team: teamId })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const newMessage = await Message.create({
      team: teamId,
      sender: req.user._id,
      senderName: req.user.fullName,
      text,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Save Message Error:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};