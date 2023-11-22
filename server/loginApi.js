import express from "express";

export const loginApi = express.Router();

loginApi.post("", (req, res) => {
    res.cookie("username", req.body.username, { signed: true });
    res.sendStatus(204);
});
loginApi.post("/access_token", (req, res) => {
    res.cookie("access_token", req.body.access_token, { signed: true });
    res.sendStatus(204);
});
loginApi.get("", (req, res) => {
    res.send(req.user);
});
loginApi.delete("", (req, res) => {
    res.clearCookie("username");
    res.clearCookie("access_token");
    res.sendStatus(204);
});