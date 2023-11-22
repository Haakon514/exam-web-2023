import React, { useEffect, useState } from "react";
import { LoginContext } from "../loginComponents/LoginContext";
import { Link, Route, Routes } from "react-router-dom";
import { LoginNavLink } from "../loginComponents/LoginNavlink";
import { ProfilePage } from "../profile/ProfilePage";
import { LoginCallback } from "../loginComponents/LoginCallback";
import { LoginWithOpenidButton } from "../loginComponents/LoginWithOpenIDConnectButton";
import { ChatRoom } from "../chatComponents/ChatRoom";

const GOOGLE_CLIENT_ID =
    "527176474036-s706db9bute4p0esgd3bftq9dislkrmr.apps.googleusercontent.com";

export function App() {
    const [username, setUsername] = useState();
    const [user, setUser] = useState();

    async function loadUser() {
        const res = await fetch("/api/login");
        if (!res.ok) {
            throw new Error("Something went wrong fetching user " + res.statusText);
        }
        const user = await res.json();
        setUser(user);
        setUsername(user.username);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <LoginContext.Provider
            value={{ username, user, loadUser, client_id: GOOGLE_CLIENT_ID }}
        >
            <header>
                <h1>Welcome to the Chat application!</h1>
            </header>
            <nav>
                <Link to={"/"}>Front page</Link>
                <Link to={"/api/chats"}>ChatRoom</Link>
                <div className={"divider"} />
                <LoginNavLink />
            </nav>
            <main>
                <Routes>
                    <Route
                        path={"/"}
                        element={<h2>Hello this is a chat Application :)</h2>}
                    />
                    <Route path={"/login"} element={<LoginWithOpenidButton />} />
                    <Route path={"/login/callback"} element={<LoginCallback />} />
                    <Route path={"/profile"} element={<ProfilePage />} />
                    <Route path={"*"} element={<h2>Not Found</h2>} />
                    <Route path={"/api/chats"} element={<ChatRoom />} />
                </Routes>
            </main>
            <footer>made by Håkon Gulliksrud Exam web and api-design 2023</footer>
        </LoginContext.Provider>
    );
}