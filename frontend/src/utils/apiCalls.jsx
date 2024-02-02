import { useEffect, useState } from "react"
import serverUrl from "./urls"

export function getData(route){
    const [data,setData] = useState([])
    useEffect(()=>{
        fetch(serverUrl+route,{
            headers:{
                authorization:localStorage.getItem("token")||null
            }
        })
        .then(res=>res.json())
        .then(data=>setData(data))
        .catch(err=>console.log(err))
    },[])
    return [data,setData]
}