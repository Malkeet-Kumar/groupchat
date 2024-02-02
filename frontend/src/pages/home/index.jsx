import { useContext, useEffect, useRef, useState } from 'react'
import GroupCard from '../../components/groupCard'
import MessageContainer from '../../components/messageContainer'
import style from './style.module.css'
import serverUrl from '../../utils/urls'
import { SocketContext } from '../../states/socketState'
import { getData } from '../../utils/apiCalls'
import { UserAuthContext } from '../../states/authState'
import { RiDashboard3Fill } from "react-icons/ri"
import { message, DatePicker, Modal } from 'antd'
const { RangePicker } = DatePicker
import { IoAdd, IoAddCircleSharp, IoLogOut, IoSearch } from "react-icons/io5";
import { Navigate, useNavigate } from 'react-router-dom'
import { FaUserFriends } from 'react-icons/fa'
import { MdGroupAdd } from 'react-icons/md'

const MetricItem = ({ data, title }) => {
    const { name, count } = data
    return (
        <div className={style.metricItem}>
            <p>{name}</p>
            <p>{title} : {count}</p>
            <img src={null || ""} alt="" />
        </div>
    )
}

const GroupForm = ({ isModalOpen, handleCancel, groupData, setGroupData, setGpimg, createGroup }) => {
    return (
        <Modal title={<h2>Create Group</h2>} open={isModalOpen} onOk={createGroup} onCancel={handleCancel}>
            <div className={style.createGroup}>
                <input type="text" placeholder='Group Name...' value={groupData.gpname} onInput={e => setGroupData({ ...groupData, gpname: e.target.value })} />
                <input type="text" placeholder='Group Descrition....' value={groupData.gpdesc} onInput={e => setGroupData({ ...groupData, gpdesc: e.target.value })} />
                <input type="file" onInput={e => setGpimg(e.target.files[0])} />
                {/* <button onCl}>Create Group</button> */}
            </div>
        </Modal>
    )
}


const Metrics = () => {
    const [metrics, setMetrics] = useState({ groups: [], regions: [], users: [] })

    const fetchData = async () => {
        try {
            const res = await fetch(serverUrl + "metrics?param=groups", {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            const res1 = await fetch(serverUrl + "metrics?param=regions", {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            const res2 = await fetch(serverUrl + "metrics?param=users", {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            const groups = await res.json()
            const regions = await res1.json()
            const users = await res2.json()
            setMetrics({
                groups,
                users,
                regions
            })
            message.success("Data fetched")
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className={style.metrics}>
            <div className={style.trendingGroups}>
                <h2>Top 5 trending Groups</h2>
                <div className={style.metricList}>
                    <RangePicker />
                    {metrics.groups.map(item => <MetricItem title="Posts" data={item} />)}
                </div>
            </div>
            <div className={style.trendingRegions}>
                <h2>Top 5 trending Regions</h2>
                <div className={style.metricList}>
                    <RangePicker />
                    {metrics.regions.map(item => <MetricItem title="Active Users" data={item} />)}
                </div>
            </div>
            <div className={style.trendingUsers}>
                <h2>Top 5 trending Users</h2>
                <div className={style.metricList}>
                    <RangePicker />
                    {metrics.users.map(item => <MetricItem title="Posts" data={item} />)}
                </div>
            </div>
        </div>
    )
}

export default function Home() {
    const { socket } = useContext(SocketContext)
    const { user, setUser } = useContext(UserAuthContext)
    const [data, setData] = getData("group")
    const [msgs, setMsgs] = useState([])
    const [showForm, setShowForm] = useState(false)

    const navigate = useNavigate()

    const [groupData, setGroupData] = useState({ gpname: "", gpdesc: "" })
    const [gpimg, setGpimg] = useState(null)
    const [currGroupId, setCurrGroupId] = useState("")
    const [currGroup, setCurrGroup] = useState({})

    const [inviteList, setInviteList] = useState([])
    const [showTopBar, setShowTopBar] = useState(false)

    const [showMetrics, setShowMetrics] = useState(false)

    function useChatScroll(dep) {
        const ref = useRef()
        useEffect(() => {
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, [dep]);
        return ref;
    }

    const ref = useChatScroll(msgs)

    const createGroup = () => {

        if (groupData.gpname.length < 3 || groupData.gpdesc.length < 3 || gpimg == null) {
            message.warning("Enter proper details")
            return
        }
        const formData = new FormData()
        formData.append("gpname", groupData.gpname)
        formData.append("gpdesc", groupData.gpdesc)
        formData.append("gpimg", gpimg)

        fetch(serverUrl + "group", {
            method: "POST",
            headers: {
                'authorization': localStorage.getItem("token")
            },
            body: formData
        })
            .then(res => {
                setShowForm(false)
                if (res.ok) {
                    message.success("new group created")
                    return res.json()
                } else {
                    message.warning("Somthing went wrong")
                }
            })
            .then(group => setData(p => [...p, group]))
            .catch(err => {
                setShowForm(false)
                message.error("Server error occured", err)
            })
    }

    const newGroupProps = {
        groupData,
        setGroupData,
        gpimg,
        setGpimg,
        createGroup,
        isModalOpen: showForm,
        handleCancel: () => {
            setShowForm(p => !p)
        },
        handleOk: () => {
            setShowForm(p => !p)
        }

    }

    const openChat = async (g_id) => {
        try {
            const res = await fetch(serverUrl + "chat?gid=" + g_id)
            const messages = await res.json()
            setMsgs([...messages])
            setCurrGroupId(g_id)
            setCurrGroup(p=>{
                const g =  data.filter(g=>g.g_id==g_id)
                return g[0]
            })
            setShowTopBar(true)
            // const desc = data.filter(i => i.g_id == g_id)
            socket.connect()
            socket.emit("open-group", g_id)
        } catch (error) {
            message.error("Error in loading chat")
        }
    }

    const sendMessage = async (msg, setMsg) => {
        const mymsg = {
            token: localStorage.getItem("token"),
            msg: msg,
            g_id: currGroupId,
            u_id: user.u_id,
            timestamp: new Date().toISOString()
        }
        socket.emit("messageFromUser", mymsg)
        setMsgs(p => [...p, mymsg])
        setMsg("")
    }

    useEffect(() => {
        socket.on("messageFromServer", (data) => {
            console.log("message from server", data);
            setMsgs(p => [...p, data])
        })

        socket.on("groupjoined", () => {
            console.log("joined group");
        })

        socket.on("messageFromServerAuth", (msg) => {
            message.error(msg)
        })

        return () => {
            socket.off('messageFromServer', () => {
                console.log("object");
            });
            socket.off('groupjoined', () => {
                console.log("object");
            });
        };
    }, [])

    const addUser = async () => {
        try {
            const users = inviteList.map(user => { return { u_id: user.u_id } })
            const res = await fetch(serverUrl + "join?gid=" + currGroupId, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    authorization: localStorage.getItem("token")
                },
                body: JSON.stringify(users)
            })
            if (res.ok) {
                message.success("Added peoples to this group")
                setInviteList([])
            } else {
                message.warning("Somthing went wrong")
            }
        } catch (error) {
            console.log(error);
            message.error(error)
        }
    }

    const messageContainerProps = {
        showTopBar,
        inviteList,
        setInviteList,
        sendMessage,
        addUser,
        ref,
        currGroup,
        messages: msgs
    }

    return (
        <>
            {
                user.isLoggedIn ?
                    <div className={style.container}>
                        <div className={style.header}>
                            <div className={style.profile}>
                                <img src={serverUrl + user.image} alt={user.name} />
                            </div>
                            <RiDashboard3Fill className={style.buttons} onClick={() => { setShowMetrics(p => !p) }} />
                            <IoLogOut className={style.logout} onClick={() => {
                                localStorage.removeItem("user")
                                localStorage.removeItem("token")
                                setUser(p => { return { isLoggedIn: false, name: "Guest" } })
                                navigate("/login")
                            }} />
                            <button className={style.buttons} onClick={() => { setShowForm(p => !p) }}><MdGroupAdd /></button>
                            <GroupForm {...newGroupProps} />
                        </div>
                        <div className={style.groups}>
                            <div className={style.searchBar}>
                                <input type="text" placeholder='Search...' />
                                <button><IoSearch /></button>
                            </div>
                            <div className={style.groupList}>
                                <h2>Groups</h2>
                                {data.map(a => <GroupCard data={a} onclick={openChat} />)}
                            </div>
                        </div>
                        <div className={style.subContainer}>
                            <MessageContainer {...messageContainerProps} />
                        </div>
                    </div>
                    :
                    <Navigate to="/login" />
            }
        </>
    )
}