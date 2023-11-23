import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { chatEndPoints, chatsApi } from "./chatsApi.js";
import { loginApi } from "./loginApi.js";
import * as path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { WebSocketServer } from "ws";

dotenv.config();
const app = express();

const COOKIE_SECRET = process.env.Cookie_Secret; //husk .env fil med cookie secret

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

const DISCOVERY_URL =
    "https://accounts.google.com/.well-known/openid-configuration";

const Mongo_URL = `mongodb+srv://haakon514:${process.env.MongoDB_Password}@cluster0.2zao8uk.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`; //husk .env fil med passord

const client = new MongoClient(Mongo_URL);

client.connect().then((connection) => {
    const db = connection.db("chats");
    chatEndPoints(db);
});

app.use(async (req, res, next) => {
    const { username, access_token } = req.signedCookies;
    if (access_token) {
        const res = await fetch(DISCOVERY_URL);
        const discoveryDoc = await res.json();

        const userinfoRes = await fetch(discoveryDoc.userinfo_endpoint, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!userinfoRes.ok) {
            throw new Error("The error was " + userinfoRes.statusText);
        }
        const userinfo = await userinfoRes.json();

        req.user = { ...userinfo, username: userinfo.email };
    } else {
        req.user = { username };
    }
    next();
});

//Api'er
app.use("/api/login", loginApi);
app.use("/api/chats", chatsApi);

app.use(express.static("../client/dist"));
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        res.sendFile(path.resolve("../client/dist/index.html"));
    } else {
        next();
    }
});

const server = app.listen(process.env.Port || 3000);

const wsServer = new WebSocketServer({ noServer: true });

const sockets = [];

server.on("upgrade", (req, socket, head) => {
    const signedCookies = cookieParser.signedCookies(COOKIE_SECRET);
    const { username } = signedCookies;
    wsServer.handleUpgrade(req, socket, head, (socket) => {
        sockets.push(socket);
        socket.on("message", (buffer) => {
            const message = buffer.toString();
            for (const s of sockets) {
                s.send(
                    JSON.stringify({
                        username,
                        message,
                    }),
                );
            }
        });
    });
});