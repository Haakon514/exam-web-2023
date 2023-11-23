import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../loginComponents/LoginContext";
import { DeleteChat } from "./DeleteChat";
export function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [webSocket, setWebSocket] = useState();

    const { username } = useContext(LoginContext);

    async function fetchChats() {
        try {
            const res = await fetch("http://localhost:3000/api/chats");
            if (!res.ok) {
                throw new Error("sorry cant fetch chats!" + res.statusText);
            }
            const messages = await res.json();
            setMessages(messages);
        } catch (error) {
            console.error("something went wrong", error);
        }
    }

    useEffect(() => {
        fetchChats();
        const webSocket = new WebSocket("ws://" + window.location.host);
        webSocket.onmessage = (event) => {
            setMessages((current) => [...current, JSON.parse(event.data)]);
        };

        setWebSocket(webSocket);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

            await fetch("http://localhost:3000/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newMessage, username }),
            });

            webSocket.send(newMessage);

            setNewMessage("");
        }

    return (
        <>
            <header>
                <h1>Chat application</h1>
                <div>USER : {username}</div>
            </header>

            <main>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{message.username}</strong> : {message.newMessage}
                        <DeleteChat props={message.id} />
                    </li>
                ))}
            </main>
            <footer>
                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        value={newMessage}
                        placeholder={"insert message"}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button>Send</button>
                </form>
            </footer>
        </>
    );
}