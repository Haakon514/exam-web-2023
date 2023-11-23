import express from "express";

export const chatsApi = express.Router();

export function chatEndPoints(db) {
    chatsApi.get("", async (req, res) => {
        const chatC = await db.collection("chat-database").find();
        const chats = await chatC.toArray();
        res.json(chats);
    });

    chatsApi.post("", async (req, res) => {
        const { newMessage, username } = req.body;
        await db.collection("chat-database").insertOne({ newMessage, username });
        res.sendStatus(204);
    });

    chatsApi.delete("/:id", async (req, res) => {
        const { _id } = req.params;
        await db.collection("chat-database").deleteOne({ id: _id });
        res.sendStatus(204);
    });
}