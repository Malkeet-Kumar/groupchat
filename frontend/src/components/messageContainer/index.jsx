import { useContext, useState } from 'react'
import style from './style.module.css'
import { IoOptions, IoPersonAdd, IoSend } from 'react-icons/io5'
import { MdPersonAddAlt, MdPersonAddAlt1 } from 'react-icons/md'
import { UserAuthContext } from '../../states/authState'
import MyModal from '../../components/modal'
import serverUrl from '../../utils/urls'
import logo from '../../assets/chatLogoBg3.png'

const MyMessage = ({ msg }) => {
    const { user } = useContext(UserAuthContext)

    const time = (timestamp) => {
        const options = { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' }
        return new Intl.DateTimeFormat('en-us', options).format(new Date(timestamp))
    }
    return (
        <>
            <div className={msg.u_id == user.u_id ? style.myMessage : style.otherMessage}>
                <p className={style.username}>{msg.u_id == user.u_id ? null : msg.name}</p>
                <p className={style.message}>{msg.msg}</p>
                <p className={style.time}>{time(msg.timestamp)}</p>
                <div className={style.dot }></div>
            </div>
        </>
    )
}

const SendInput = ({ onSend }) => {
    const [msg, setMsg] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        // onSend(msg, setMsg)
    }

    return (
        <form className={style.sendBox} onSubmit={handleSubmit}>
            <input type="text" value={msg} placeholder='Type Somthing here....' onInput={e => setMsg(e.target.value)} />
            <button onClick={e => onSend(msg, setMsg)}><IoSend /></button>
        </form>
    )
}

export default function MessageContainer({ showTopBar, addUser, messages, sendMessage, inviteList, setInviteList, currGroup, ref }) {
    const { user } = useContext(UserAuthContext)
    const [showPopup, setShowPopup] = useState(false)
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])

    const fetchUsers = async (text) => {
        try {
            const res = await fetch(serverUrl + "users?text=" + search, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            const userss = await res.json()
            const filtered = userss.filter(u => u.u_id != user.u_id)
            setUsers(filtered)
        } catch (error) {
            console.log(error);
            message.error("Server error")
        }
    }

    return (
        <div className={style.container}>
            {
                showTopBar ?
                    <>
                        <div className={style.groupActions}>
                            <div>
                                <div className={style.pic}>
                                    <img src={serverUrl + currGroup.image} alt="Image" />
                                </div>
                                <div className={style.des}>
                                    <h3>{currGroup?.description}</h3>
                                </div>
                            </div>
                            <IoPersonAdd className={style.addUser} onClick={() => {
                                setShowPopup(p => !p)
                            }} />
                        </div>
                        <div className={style.subContainer} ref={ref}>
                            {messages.map(m => <MyMessage msg={m} />)}
                        </div>
                        <SendInput onSend={sendMessage} />
                        <MyModal isModalOpen={showPopup} setIsModalOpen={setShowPopup} users={users} setUsers={setUsers} onSearch={fetchUsers} setSearch={setSearch} search={search} selected={inviteList} setSelected={setInviteList} addUser={addUser} />
                    </>
                    :
                    <div className={style.logoBg}>
                        <img src={logo} alt="Logo image" />
                        <h2>Group Chat App</h2>
                    </div>
            }
        </div >
    )
}