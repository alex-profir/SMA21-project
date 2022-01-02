import { useState } from "react";
import React from "react";
import { createContext } from "react";
import { endpointURL } from "../services/config";
import { io, Socket } from "socket.io-client";
import { useEffectAsync } from "../hooks/useEffectAsync";
import { getCurrentUser } from "../services/auth.service";
import { useDispatch, useSelector } from "../store";
import { retrieveStorageToken } from "../utils/utilFunctions";
import * as Notifications from 'expo-notifications';

export const SocketContext = createContext<Socket>(null!);

export async function schedulePushNotification(message: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },

        },
        trigger: { seconds: 2 },
    });
}


export const SocketIoContextProvider: React.FC = ({ children }) => {
    const user = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState<Socket>(null!);
    useEffectAsync(async () => {
        if (user && !socket) {
            const socket = io(endpointURL!);
            const token = await retrieveStorageToken();
            socket.emit('authenticate', token);
            // socket.emit("init", user);
            setSocket(socket);

            socket.on(user._id, async () => {
                const req = await getCurrentUser();
                dispatch({
                    type: "SET_USER",
                    user: req.data,
                });
                socket.emit("update");
            })
        }
        if (!user && socket && socket.connected) {
            socket.disconnect();
            setSocket(null!);
        }
        return () => {
            if (socket && socket.connected) {
                setSocket(null!);
            }
        }
    }, [user, socket]);
    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}
