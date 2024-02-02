import { useState } from 'react'
import React from "react";
export const UserAuthContext = React.createContext()
export function AuthState(props){
    const userd = JSON.parse(localStorage.getItem("user"))?JSON.parse(localStorage.getItem("user")):{user:"Guest",isLoggedIn:false}
    const [user,setUser] = useState(userd)
    console.log(userd);
    return (
        <UserAuthContext.Provider value={{user,setUser}}>
            {props.children}
        </UserAuthContext.Provider>
    )
}