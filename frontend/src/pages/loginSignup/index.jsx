import { useContext, useState } from 'react'
import style from './style.module.css'
import serverUrl from '../../utils/urls'
import { Navigate, useNavigate } from 'react-router-dom'
import { getData } from "../../utils/apiCalls"
import { UserAuthContext } from '../../states/authState'
import { message } from 'antd'

const LoginForm = ({ loginProps }) => {
    const { changeForm, loginCreds, setLoginCreds, login } = loginProps
    return (
        <div className={style.login}>
            <h2>Login</h2>
            <div className={style.inpGroup}>
                <label htmlFor="">Email</label>
                <input type="text" value={loginCreds.email} onInput={e => setLoginCreds({ ...loginCreds, email: e.target.value })} placeholder='email' />
            </div>
            <div className={style.inpGroup}>
                <label htmlFor="">Password</label>
                <input type="text" value={loginCreds.password} onInput={e => setLoginCreds({ ...loginCreds, password: e.target.value })} placeholder='password' />
            </div>
            <button onClick={() => { login() }}>Login</button>
            <p onClick={() => { changeForm() }}>create new account</p>
        </div>
    )
}

const SignupForm = ({ signupProps }) => {
    const { changeForm, signupCreds, setSignupCreds, pimg, setPimg, signupUser, regions } = signupProps
    return (
        <div className={style.signup}>
            <h2>Signup</h2>
            <div className={style.inpGroup}>
                <label htmlFor="">Name</label>
                <input type="text" value={signupCreds.name} onInput={e => setSignupCreds({ ...signupCreds, name: e.target.value })} placeholder='Name' />
            </div>
            <div className={style.inpGroup}>
                <label htmlFor="">Email</label>
                <input type="text" value={signupCreds.email} onInput={e => setSignupCreds({ ...signupCreds, email: e.target.value })} placeholder='Email' />
            </div>
            <div className={style.inpGroup}>
                <label htmlFor="">Password</label>
                <input type="text" value={signupCreds.password} onInput={e => setSignupCreds({ ...signupCreds, password: e.target.value })} placeholder='password' />
            </div>
            <div className={style.inpGroup}>
                <label htmlFor="">Region</label>
                <select onInput={e => setSignupCreds({ ...signupCreds, region: e.target.value })}>
                    {regions.map(r => <option value={r.r_id}>{r.region}</option>)}
                </select>
            </div>
            <div className={style.inpGroup}>
                <label htmlFor="">Profile Image</label>
                <input type="file" onInput={e => setPimg(e.target.files[0])} />
            </div>
            <button onClick={() => { signupUser() }}>Sign Up</button>
            <p onClick={() => { changeForm() }}>Login here</p>
        </div>
    )
}

export default function LoginPage() {
    const { user, setUser } = useContext(UserAuthContext)
    const [login, setLogin] = useState(true)
    const [data, setData] = getData("regions")
    const [loginCreds, setLoginCreds] = useState({ email: "", password: "" })
    const [signupCreds, setSignupCreds] = useState({ email: "", password: "", name: "", region: "" })
    const [pimg, setPimg] = useState(null)
    const navigate = useNavigate()

    const changeForm = () => {
        setLogin(p => !p)
    }

    const loginUser = async () => {
        try {
            const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
            if (!regex.test(loginCreds.email)) {
                message.warning("Email is not valid !")
                return
            }
            if (loginCreds.password.length < 8) {
                message.warning("Password must be 8 character long !")
                return
            }
            const res = await fetch(serverUrl + "login", {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ ...loginCreds })
            })
            if (res.status == 200) {
                const u = await res.json()
                localStorage.setItem("token", u.token)
                setUser({ ...u.user[0], isLoggedIn: true })
                localStorage.setItem("user", JSON.stringify({ ...u.user[0], isLoggedIn: true }))
                navigate("/")
            } else {
                message.warning("Invalid credentials")
            }
        } catch (error) {
            message.error("Server error")
            console.log(error);
        }
    }

    function validateFile(image) {
        if (!image) {
            message.warning("Select a profile image")
            return false;
        }
        if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            message.warning("Select a valid image")
            return false;
        }
        return true
    }

    const signupUser = async () => {
        if (signupCreds.name.length < 5) {
            message.warning("Name must be at least 5 characters long")
            return
        }
        const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
        if (!regex.test(signupCreds.email)) {
            message.warning("enter a valid email.")
            return
        }
        if (signupCreds.password.length < 8) {
            message.warning("Password must be 8 digits long.")
            return
        }
        if (signupCreds.region == "") {
            message.warning("please choose a region")
            return
        }
        if (!validateFile(pimg)) {
            return
        }
        const formData = new FormData()
        formData.append("name", signupCreds.name)
        formData.append("email", signupCreds.email)
        formData.append("password", signupCreds.password)
        formData.append("region", signupCreds.region)
        formData.append("image", pimg)

        try {
            const res = await fetch(serverUrl + "signup", {
                method: "POST",
                body: formData
            })
            if (res.ok) {
                setSignupCreds({ name: "", email: "", password: "", region: "" })
                message.success("Registered successfully")
                setLogin(p => !p)
                navigate("/login")
            } else {
                message.warning("Somthing went wrong")
            }
        } catch (error) {
            message.error("Server error")
            console.log(error);
        }
    }

    const loginProps = {
        changeForm,
        loginCreds,
        setLoginCreds,
        login: loginUser
    }

    const signupProps = {
        changeForm,
        signupCreds,
        setSignupCreds,
        pimg,
        setPimg,
        signupUser,
        regions: data
    }

    return (
        <>
            {
                user.isLoggedIn
                ?
                <Navigate to="/" />
                :
                <div className={style.container}>
                    <div className={style.header}>
                        <h2>Chat App</h2>
                    </div>
                    <div className={style.subcontainer}>
                        {
                            login ?
                                <LoginForm loginProps={loginProps} /> :
                                <SignupForm signupProps={signupProps} />
                        }
                    </div>
                </div>
            }
        </>
    )
}