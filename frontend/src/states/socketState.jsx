import React from "react";
import { io } from 'socket.io-client';
export const SocketContext = React.createContext()

export function SocketState(props) {
    const URL = 'http://127.0.0.1:8000'
    const socket = io(URL)
    return (
        <SocketContext.Provider value={{ socket }}>
            {
                props.children
            }
        </SocketContext.Provider>
    )
}