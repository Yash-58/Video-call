import axios from "axios";
import httpStatus from "http-status";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name") || "";
        const username = localStorage.getItem("username") || "";
        return token ? { token, name, username } : null;
    });

    const router = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !userData) {
            const name = localStorage.getItem("name") || "";
            const username = localStorage.getItem("username") || "";
            setUserData({ token, name, username });
        }
    }, [userData]);

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            if (request.status === httpStatus.OK) {
                const token = request.data.token;
                const user = request.data.user || {};
                const name = user.name || username;

                localStorage.setItem("token", token);
                localStorage.setItem("username", user.username || username);
                localStorage.setItem("name", name);

                setUserData({
                    token: token,
                    username: user.username || username,
                    name: name
                });

                router("/home");
                return request.data;
            }
        } catch (err) {
            throw err;
        }
    };

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });

            if (request.status === httpStatus.CREATED) {
                // Automatically log the user in so they don't have to enter their credentials again
                return await handleLogin(username, password);
            }
        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("displayName");
        setUserData(null);
        router("/auth");
    };

    const getHistoryOfUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return [];

            let request = await client.get("/get_all_activity", {
                params: {
                    token: token
                }
            });
            return request.data;
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                handleLogout();
            }
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return null;

            let request = await client.post("/add_to_activity", {
                token: token,
                meeting_code: meetingCode
            });
            return request;
        } catch (e) {
            console.warn("Could not save to history:", e.message);
            return null;
        }
    };

    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin,
        handleLogout
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};